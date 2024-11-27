<?php

namespace App\Http\Controllers;

use App\Models\Farmer;
use Illuminate\Http\Request;

class FarmerController extends Controller
{
    public function index(Request $request)
    {
        // Get the pageSize and searchTerm from the request
        $pageSize = $request->query('pageSize'); // If not provided, it will be null
        $searchTerm = $request->query('searchTerm'); // Optional search term for farmerName

        // Build the query
        $query = Farmer::query();

        // If search term is provided, apply the filter for farmerName
        if ($searchTerm) {
            $query->where('farmerName', 'like', "%$searchTerm%");
        }

        // If pageSize is provided, paginate the results; otherwise, return all records
        if ($pageSize) {
            $farmers = $query->orderBy('farmerId', 'desc')->paginate($pageSize);
        } else {
            $farmers = $query->orderBy('farmerId', 'desc')->get(); // Return all records
        }

        // Return the results as JSON response
        return response()->json($farmers, 200);
    }



    public function store(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'barangayId' => 'required|exists:barangays,barangayId',
            'farmerName' => 'required|string|max:255',
            'fieldArea' => 'nullable|numeric',
            'fieldType' => 'required|string|max:255',
            'phoneNumber' => 'nullable|string|max:255',
        ]);

        // If validation passes, create a new farmer record
        $farmer = new Farmer([
            'barangayId' => $request->input('barangayId'),
            'farmerName' => $request->input('farmerName'),
            'fieldArea' => $request->input('fieldArea'),
            'fieldType' => $request->input('fieldType'),
            'phoneNumber' => $request->input('phoneNumber'),
        ]);

        // Save the farmer record to the database
        $farmer->save();

        // Return a JSON response with the created farmer data and status code 201 (Created)
        return response()->json($farmer, 201);
    }

    public function show($id)
    {
        $farmer = Farmer::findOrFail($id);
        return response()->json($farmer);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'barangayId' => 'exists:barangays,barangayId',
            'farmerName' => 'string|max:255',
            'fieldArea' => 'nullable|numeric',
            'fieldType' => 'string|max:255',
            'phoneNumber' => 'nullable|string|max:255',
        ]);

        $farmer = Farmer::findOrFail($id);
        $farmer->update($request->all());

        return response()->json($farmer, 200);
    }

    public function destroy($id)
    {
        $farmer = Farmer::findOrFail($id);
        $farmer->delete();

        return response()->json(null, 204);
    }
}
