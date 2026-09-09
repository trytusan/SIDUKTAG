<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PengaturanController extends Controller
{
    public function index(Request $request)
    {
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['user' => $request->user()]);
        }
        return view('user.pengaturan.index');
    }

    public function akun(Request $request)
    {
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['user' => $request->user()]);
        }
        return view('user.pengaturan.akun');
    }

    public function updateAkun(Request $request)
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

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Informasi akun berhasil diperbarui.',
                'user' => $user->fresh(),
            ]);
        }

        return back()->with('status', 'Informasi akun berhasil diperbarui.');
    }

    public function password(Request $request)
    {
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['user' => $request->user()]);
        }
        return view('user.pengaturan.password');
    }
}