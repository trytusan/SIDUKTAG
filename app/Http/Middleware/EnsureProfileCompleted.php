<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureProfileCompleted
{
    public function handle(Request $request, Closure $next): Response
    {
        // kalau belum login, biarkan middleware auth yang handle
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $user = auth()->user();

        // hanya berlaku untuk user (bukan admin)
        if ($user->role === 'user') {

            // cek apakah sudah punya data penduduk
            if (!$user->penduduk) {
                return redirect()->route('user.onboarding.step-1');
            }

            // cek apakah profil sudah lengkap
            if (!$user->penduduk->is_profile_completed) {

                // biar tidak loop redirect saat di halaman onboarding
                if (!$request->routeIs('user.onboarding.*')) {
                    return redirect()->route('user.onboarding.step-1');
                }
            }
        }

        return $next($request);
    }
}