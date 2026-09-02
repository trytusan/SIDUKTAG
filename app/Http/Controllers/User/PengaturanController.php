<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class PengaturanController extends Controller
{
    public function index(): View
    {
        return view('user.pengaturan.index');
    }

    public function akun(): View
    {
        return view('user.pengaturan.akun');
    }

    public function updateAkun(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
        ], [
            'name.required' => 'Username wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
        ]);

        $user->update($validated);

        return back()->with('status', 'Informasi akun berhasil diperbarui.');
    }

    public function password(): View
    {
        return view('user.pengaturan.password');
    }
}