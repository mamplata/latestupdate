<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class BarangayController extends Controller
{

    public function index(Request $request)
    {
        $pageSize = $request->query('pageSize'); // Optional page size
        $barangayName = $request->query('barangayName'); // Optional barangay name filter

        // Build the query
        $query = Barangay::query();

        if ($barangayName) {
            // Filter by barangay name if specified
            $query->where('barangayName', 'like', "%$barangayName%");
        }

        // Determine whether to paginate or return all
        if ($pageSize) {
            // Paginate results if pageSize is specified
            $barangays = $query->orderBy('barangayId', 'desc')->paginate($pageSize);
        } else {
            // Return all results if no pageSize is specified
            $barangays = $query->orderBy('barangayId', 'desc')->get();
        }

        // Return barangays as JSON response
        return response()->json($barangays, 200);
    }


    public function store(Request $request)
    {
        $request->validate([
            'barangayName' => 'required|string',
            'coordinates' => 'required|string',
        ]);

        // Accessing input data using $request->input('fieldName')
        $barangay = new Barangay([
            'barangayName' => $request->input('barangayName'),
            'coordinates' => $request->input('coordinates'),
        ]);

        $barangay->save();

        return response()->json($barangay, 201);
    }

    public function show($id)
    {
        $barangay = barangay::findOrFail($id);
        return response()->json($barangay, 200);
    }

    public function update(Request $request, $id)
    {
        // Find barangay by username
        $barangay = barangay::findOrFail($id);

        // Validate request data
        $request->validate([
            'barangayName' => 'string',
            'coordinates' => 'string',
        ]);

        // Update barangay attributes
        $barangay->fill($request->only(['barangayName', 'coordinates']));

        // Save updated barangay to the database
        $barangay->save();

        // Return JSON response with the updated barangay and status code 200 (OK)
        return response()->json($barangay, 200);
    }

    public function destroy($id)
    {
        $barangay = barangay::find($id);
        if ($barangay) {
            $barangay->delete();
            return response()->json(null, 204);
        } else {
            return response()->json(['message' => 'barangay not found'], 404);
        }
    }
}
