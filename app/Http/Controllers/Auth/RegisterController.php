<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\View\View;

class RegisterController extends Controller
{
    public function showRegisterForm(): View
    {
        return view('auth.register');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'name.required' => 'Nama wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        $normalizedEmail = trim(strtolower($validated['email']));

        $user = DB::transaction(function () use ($validated, $normalizedEmail) {
            return User::create([
                'name' => trim($validated['name']),
                'email' => $normalizedEmail,
                'password' => Hash::make($validated['password']),
                'role' => 'user',
                'is_active' => true,
            ]);
        });

        Auth::login($user, true);
        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Registrasi berhasil.',
                'user' => $user,
                'role' => $user->role,
                'is_profile_completed' => false,
                'redirect' => route('user.onboarding.step-1'),
            ]);
        }

        return redirect()->route('user.onboarding.step-1');
    }
}