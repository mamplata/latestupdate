<?php
// app/Http/Middleware/CheckRole.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $role)
    {
        // Get the authenticated user
        $user = $request->user();

        // Check if the user is authenticated and has the required role
        if (!$user) {
            return response()->json([
                'message' => 'User is not authenticated.',
            ], 401);
        }

        // Check if the user has the specified role
        if (!in_array($user->role, explode(',', $role))) {
            // Create a custom error message depending on the role
            $roleMessages = [
                'admin' => 'Unauthorized access for Admin users.',
                'agriculturist' => 'Unauthorized access for Agriculturist users.',
            ];

            // Default message if the role is not matched
            $message = $roleMessages[$user->role] ?? 'Unauthorized access for this role.';

            return response()->json([
                'message' => $message,
            ], 403);
        }

        // Proceed to the next middleware or controller if the role matches
        return $next($request);
    }
}
