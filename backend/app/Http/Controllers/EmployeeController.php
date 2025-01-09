<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Employee::query();

            if ($request->has('name')) {
                $query->where('name', 'like', '%' . $request->name . '%');
            }

            if ($request->has('division_id')) {
                $query->where('division_id', $request->division_id);
            }

            $employees = $query->with('division')->paginate(5);

            return response()->json([
                'status' => 'success',
                'message' => 'Employees retrieved successfully',
                'data' => [
                    'employees' => $employees->items(),
                ],
                'pagination' => [
                    'total' => $employees->total(),
                    'current_page' => $employees->currentPage(),
                    'last_page' => $employees->lastPage(),
                    'per_page' => $employees->perPage(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error retrieving employees: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve employees',
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'image' => 'required|image',
                'name' => 'required|string|max:255',
                'phone' => 'required|string|max:20',
                'division' => 'required|uuid',
                'position' => 'required|string|max:255',
            ]);

            // Save the image file and get its path
            $imageName = Str::uuid() . '.' . $request->file('image')->getClientOriginalExtension();
            $imagePath = $request->file('image')->storeAs('images', $imageName, 'public');

            $employee = Employee::create([
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'image' => $imagePath,
                'name' => $validated['name'],
                'phone' => $validated['phone'],
                'division_id' => $validated['division'],
                'position' => $validated['position'],
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Employee created successfully',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating employee: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create employee',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $employee = Employee::with('division')->findOrFail($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Employee retrieved successfully',
                'data' => [
                    'employee' => $employee,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error retrieving employee: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve employee',
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $employee = Employee::findOrFail($id);
            
            $validated = $request->validate([
                'image' => 'nullable|image',
                'name' => 'required|string|max:255',
                'phone' => 'required|string|max:20',
                'division' => 'required|uuid',
                'position' => 'required|string|max:255',
            ]);

            if ($request->hasFile('image')) {
                // Delete the old image from storage
                Storage::delete('public/' . $employee->image);

                // Rename the new image file to avoid conflicts
                $imageName = Str::uuid() . '.' . $request->file('image')->getClientOriginalExtension();
                $imagePath = $request->file('image')->storeAs('images', $imageName, 'public');
                $employee->image = $imagePath;
            }

            $employee->name = $validated['name'];
            $employee->phone = $validated['phone'];
            $employee->division_id = $validated['division'];
            $employee->position = $validated['position'];
            $employee->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Employee updated successfully',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating employee: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update employee',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $employee = Employee::findOrFail($id);

            // Delete image file from storage
            Storage::delete('public/' . $employee->image);

            $employee->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Employee deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting employee: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete employee',
            ], 500);
        }
    }
}
