<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class LoginController extends Controller
{
    public function showLoginForm(): View
    {
        return view('auth.login');
    }

    public function login(Request $request): RedirectResponse
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

            return redirect()
                ->route('login')
                ->with('error', 'Akun Anda tidak aktif.');
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

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}