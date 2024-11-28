<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\CheckUserSession;
use App\Http\Middleware\AttachSanctumTokenFromCookie;
use App\Http\Middleware\TrimTrailingSlashes;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(prepend: [
            AttachSanctumTokenFromCookie::class,
        ]);
        $middleware->web(prepend: [
            \Illuminate\Session\Middleware\StartSession::class,
            AttachSanctumTokenFromCookie::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
            Illuminate\Cookie\Middleware\EncryptCookies::class,
            Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
        ]);
        $middleware->alias([
            'check.user.session' => CheckUserSession::class,
            'trailing.slash' => TrimTrailingSlashes::class,
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
