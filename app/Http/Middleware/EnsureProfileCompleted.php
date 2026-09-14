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
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            return redirect()->route('login');
        }

        $user = auth()->user();

        // hanya berlaku untuk user (bukan admin)
        if ($user->role === 'user') {
            // Izinkan rute pengaturan profil & akun agar pengguna selalu bisa melihat dan memperbarui profilnya
            if ($request->routeIs('user.pengaturan.*') || $request->is('user/pengaturan*')) {
                return $next($request);
            }

            // cek apakah sudah punya data penduduk dan profil sudah lengkap
            if (!$user->penduduk || !$user->penduduk->is_profile_completed) {
                if ($request->wantsJson() || $request->is('api/*')) {
                    return response()->json([
                        'message' => 'Profil kependudukan belum lengkap. Silakan lengkapi data onboarding.',
                        'is_profile_completed' => false,
                        'redirect' => route('user.onboarding.step-1'),
                    ], 403);
                }

                // biar tidak loop redirect saat di halaman onboarding
                if (!$request->routeIs('user.onboarding.*')) {
                    return redirect()->route('user.onboarding.step-1');
                }
            }
        }

        return $next($request);
    }
}