<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsUser
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            return redirect()->route('login');
        }

        if (auth()->user()->role !== 'user') {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Akses ditolak. Halaman ini hanya untuk pengguna.'], 403);
            }
            abort(403, 'Akses ditolak. Halaman ini hanya untuk pengguna.');
        }

        return $next($request);
    }
}