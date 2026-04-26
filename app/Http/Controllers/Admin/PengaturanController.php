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
    public function index(): View
    {
        return view('admin.pengaturan.index');
    }

    public function profil()
    {
        $user = auth()->user();
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

        return back()->with('status', 'Profil berhasil diperbarui!');
    }

    public function akun()
    {
        $user = auth()->user();
        return view('admin.pengaturan.akun', compact('user'));
    }

    public function password()
    {
        return view('admin.pengaturan.password');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            // Memastikan password lama sesuai dengan yang ada di database
            'current_password' => ['required', 'current_password'],

            // Memastikan password baru kuat dan cocok dengan konfirmasi
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->letters()->numbers()
            ],
        ], [
            'current_password.current_password' => 'Password lama yang Anda masukkan salah.',
            'password.confirmed' => 'Konfirmasi password baru tidak cocok.',
        ]);

        // Update password user yang sedang login
        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('status', 'Password berhasil diperbarui.');
    }

    public function updateAkun(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            // Username biasanya merujuk ke kolom 'name' atau jika Anda punya kolom 'username' sendiri
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'status_akun' => ['required', 'in:Aktif,Nonaktif'],
        ]);

        // Update data ke database
        $user->update($validated);

        return back()->with('status', 'Pengaturan akun berhasil diperbarui.');
    }
}