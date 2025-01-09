<?php

namespace App\Http\Controllers\Auth;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Laravel\Sanctum\HasApiTokens;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        if (Auth::guard('api')->check()) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are already logged in',
            ], 400);
        }

        $validated = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $admin = Admin::where('username', $validated['username'])->first();

        if ($admin && Hash::check($validated['password'], $admin->password)) {

            $token = $admin->createToken('AdminToken')->plainTextToken;

            // Return success response with token and admin data
            return response()->json([
                'status' => 'success',
                'message' => 'Login successful',
                'data' => [
                    'token' => $token,
                    'admin' => [
                        'id' => $admin->id,
                        'name' => $admin->name,
                        'username' => $admin->username,
                        'phone' => $admin->phone,
                        'email' => $admin->email,
                    ],
                ],
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Invalid username or password',
        ], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logout successful',
        ]);
    }
}
