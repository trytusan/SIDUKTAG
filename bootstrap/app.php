<?php

use App\Http\Middleware\EnsureProfileCompleted;
use App\Http\Middleware\IsAdmin;
use App\Http\Middleware\IsUser;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        
        // 1. Daftarkan alias middleware Anda di sini
        $middleware->alias([
            'admin' => \App\Http\Middleware\IsAdmin::class,
            'user'  => \App\Http\Middleware\IsUser::class,
            'profile.completed' => \App\Http\Middleware\EnsureProfileCompleted::class,
        ]);

        // 2. Logika redirect yang kita buat sebelumnya
        $middleware->redirectUsersTo(function () {
            $user = auth()->user();
            if ($user && $user->role === 'admin') {
                return route('admin.dashboard');
            }
            return route('user.dashboard');
        });
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();