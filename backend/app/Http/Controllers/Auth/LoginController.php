<?php

namespace App\Http\Controllers\Auth;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\HasApiTokens;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        try {
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
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete(); // Revoke all tokens

        return response()->json([
            'status' => 'success',
            'message' => 'Logout successful',
        ]);
    }
}
