<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class PengaturanController extends Controller
{
    public function index(): View
    {
        return view('admin.pengaturan.index');
    }

    public function profil(): View
    {
        return view('admin.pengaturan.profil');
    }

    public function akun(): View
    {
        return view('admin.pengaturan.akun');
    }

    public function password(): View
    {
        return view('admin.pengaturan.password');
    }

    public function aplikasi(): View
    {
        return view('admin.pengaturan.aplikasi');
    }

    public function updateAkun(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
        ]);

        $user->update($validated);

        return back()->with('status', 'Informasi akun berhasil diperbarui.');
    }
}