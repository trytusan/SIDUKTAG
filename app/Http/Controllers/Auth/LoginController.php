<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class LoginController extends Controller
{
    public function showLoginForm(): View
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Password wajib diisi.',
        ]);

        $remember = $request->boolean('remember');

        if (!Auth::attempt($credentials, $remember)) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Email atau password salah.',
                    'errors' => ['email' => ['Email atau password salah.']],
                ], 422);
            }

            return back()
                ->withErrors([
                    'email' => 'Email atau password salah.',
                ])
                ->withInput($request->only('email'));
        }

        $request->session()->regenerate();

        $user = Auth::user();

        if (!$user->is_active) {
            Auth::logout();

            if ($request->expectsJson()) {
                return response()->json(['message' => 'Akun Anda tidak aktif.'], 403);
            }

            return redirect()
                ->route('login')
                ->with('error', 'Akun Anda tidak aktif.');
        }

        $redirectPath = '/admin/dashboard';
        if ($user->role === 'user') {
            $isCompleted = $user->penduduk && $user->penduduk->is_profile_completed;
            $redirectPath = $isCompleted ? '/user/dashboard' : '/user/onboarding/step-1';
        }

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Login berhasil.',
                'user' => $user,
                'role' => $user->role,
                'is_profile_completed' => $user->role === 'admin' ? true : (bool) ($user->penduduk?->is_profile_completed ?? false),
                'redirect' => $redirectPath,
            ]);
        }

        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        if ($user->role === 'user') {
            if (!$user->penduduk || !$user->penduduk->is_profile_completed) {
                return redirect()->route('user.onboarding.step-1');
            }

            return redirect()->route('user.dashboard');
        }

        Auth::logout();

        return redirect()
            ->route('login')
            ->with('error', 'Role akun tidak dikenali.');
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Logout berhasil.']);
        }

        return redirect()->route('login');
    }
}