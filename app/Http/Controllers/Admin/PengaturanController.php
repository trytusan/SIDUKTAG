<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class PengaturanController extends Controller
{
    public function index(Request $request)
    {
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['user' => auth()->user()]);
        }
        return view('admin.pengaturan.index');
    }

    public function profil(Request $request)
    {
        $user = auth()->user();
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['user' => $user]);
        }
        return view('admin.pengaturan.profil', compact('user'));
    }

    public function updateProfil(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'telepon' => ['nullable', 'string', 'max:20'],
            'jabatan' => ['nullable', 'string', 'max:100'],
        ]);

        $user->update($validated);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Profil berhasil diperbarui!',
                'user' => $user->fresh(),
            ]);
        }

        return back()->with('status', 'Profil berhasil diperbarui!');
    }

    public function akun(Request $request)
    {
        $user = auth()->user();
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['user' => $user]);
        }
        return view('admin.pengaturan.akun', compact('user'));
    }

    public function password(Request $request)
    {
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['user' => auth()->user()]);
        }
        return view('admin.pengaturan.password');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->letters()->numbers()
            ],
        ], [
            'current_password.current_password' => 'Password lama yang Anda masukkan salah.',
            'password.confirmed' => 'Konfirmasi password baru tidak cocok.',
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Password berhasil diperbarui.',
            ]);
        }

        return back()->with('status', 'Password berhasil diperbarui.');
    }

    public function updateAkun(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'status_akun' => ['nullable', 'in:Aktif,Nonaktif'],
        ]);

        $user->update($validated);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Pengaturan akun berhasil diperbarui.',
                'user' => $user->fresh(),
            ]);
        }

        return back()->with('status', 'Pengaturan akun berhasil diperbarui.');
    }
}