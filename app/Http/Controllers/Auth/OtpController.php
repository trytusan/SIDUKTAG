<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\EmailOtp;
use App\Mail\SendOtpMail;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class OtpController extends Controller
{
    /**
     * Kirim kode OTP 6-digit ke email pengguna via SMTP
     */
    public function sendOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
        ]);

        $email = trim(strtolower($request->email));
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email tidak terdaftar dalam sistem SIDUKTAG.',
            ], 404);
        }

        // Cek jeda kirim ulang (rate limiting 60 detik)
        $recentOtp = EmailOtp::where(function ($q) use ($user, $email) {
                $q->where('user_id', $user->id)->orWhere('email', $email);
            })
            ->where('created_at', '>=', Carbon::now()->subSeconds(60))
            ->first();

        if ($recentOtp) {
            $secondsLeft = 60 - Carbon::now()->diffInSeconds($recentOtp->created_at);
            return response()->json([
                'status' => 'error',
                'message' => "Mohon tunggu {$secondsLeft} detik sebelum meminta kode OTP baru.",
                'retry_after' => $secondsLeft,
            ], 429);
        }

        // Hapus kode OTP lama yang belum terpakai untuk email ini
        EmailOtp::where(function ($q) use ($user, $email) {
            $q->where('user_id', $user->id)->orWhere('email', $email);
        })->delete();

        // Generate 6 digit angka acak
        $otp = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);

        EmailOtp::create([
            'user_id' => $user->id,
            'email' => $email,
            'otp' => $otp,
            'expires_at' => Carbon::now()->addMinutes(10),
            'attempts' => 0,
        ]);

        // Kirim email menggunakan Mailable SendOtpMail via SMTP Gmail
        try {
            Mail::to($email)->send(new SendOtpMail($otp, $user->name ?? 'Warga'));
        } catch (\Throwable $e) {
            Log::error('Gagal mengirim email OTP: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengirim email: ' . $e->getMessage() . '. Pastikan pengaturan SMTP Gmail di berkas .env sudah benar.',
            ], 500);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Kode OTP 6-digit berhasil dikirim ke alamat email Anda.',
            'email' => $email,
            'expires_in' => 600, // 10 menit
        ]);
    }

    /**
     * Verifikasi kode OTP 6-digit
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'otp' => ['required', 'string', 'size:6'],
        ], [
            'email.required' => 'Email wajib diisi.',
            'otp.required' => 'Kode OTP wajib diisi.',
            'otp.size' => 'Kode OTP harus tepat 6 digit.',
        ]);

        $email = trim(strtolower($request->email));
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email tidak terdaftar.',
            ], 404);
        }

        $otpRecord = EmailOtp::where(function ($q) use ($user, $email) {
                $q->where('user_id', $user->id)->orWhere('email', $email);
            })
            ->latest()
            ->first();

        if (!$otpRecord) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kode OTP tidak ditemukan. Silakan minta kode baru.',
            ], 400);
        }

        if (Carbon::now()->isAfter($otpRecord->expires_at)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kode OTP telah kedaluwarsa (lebih dari 10 menit). Silakan minta kode baru.',
            ], 400);
        }

        if ($otpRecord->attempts >= 5) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terlalu banyak percobaan salah. Silakan minta kode baru.',
            ], 429);
        }

        if ($otpRecord->otp !== $request->otp) {
            $otpRecord->increment('attempts');
            $sisaPercobaan = 5 - $otpRecord->attempts;
            return response()->json([
                'status' => 'error',
                'message' => "Kode OTP yang Anda masukkan salah. Sisa percobaan: {$sisaPercobaan}.",
            ], 422);
        }

        $otpRecord->markAsVerified();

        return response()->json([
            'status' => 'success',
            'message' => 'Kode OTP berhasil diverifikasi!',
            'verified' => true,
        ]);
    }

    /**
     * Reset password langsung menggunakan kode OTP yang terverifikasi
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'otp' => ['required', 'string', 'size:6'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'email.required' => 'Email wajib diisi.',
            'otp.required' => 'Kode OTP wajib diisi.',
            'password.required' => 'Password baru wajib diisi.',
            'password.min' => 'Password baru minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password baru tidak cocok.',
        ]);

        $email = trim(strtolower($request->email));
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email tidak terdaftar.',
            ], 404);
        }

        $otpRecord = EmailOtp::where(function ($q) use ($user, $email) {
                $q->where('user_id', $user->id)->orWhere('email', $email);
            })
            ->where('otp', $request->otp)
            ->latest()
            ->first();

        if (!$otpRecord || Carbon::now()->isAfter($otpRecord->expires_at)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kode OTP tidak valid atau sudah kedaluwarsa. Silakan minta kode baru.',
            ], 400);
        }

        // Update password pengguna
        $user->forceFill([
            'password' => Hash::make($request->password),
        ])->save();

        // Hapus kode OTP setelah sukses digunakan
        $otpRecord->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Password Anda berhasil diperbarui! Silakan login dengan password baru Anda.',
        ]);
    }
}

