<?php

namespace App\Http\Controllers;

use App\Models\CropVariety;
use App\Models\Crop;
use Illuminate\Http\Request;

class CropVarietyController extends Controller
{
    // Get all crop varieties, optionally filtered by crop type and variety name
    public function index(Request $request)
    {
        $pageSize = $request->query('pageSize'); // Optional page size
        $cropType = $request->query('cropType'); // Optional crop type filter
        $varietyName = $request->query('varietyName'); // Optional variety name filter

        // Build the query with eager loading for crop relationship
        $query = CropVariety::with('crop');

        if ($cropType) {
            // Filter by cropType in the related Crop model
            $query->whereHas('crop', function ($q) use ($cropType) {
                $q->where('cropType', $cropType);
            });
        }

        if ($varietyName) {
            // Filter by varietyName
            $query->where('varietyName', 'like', "%$varietyName%");
        }

        // Check if pagination is requested
        if ($pageSize) {
            // Paginate results if pageSize is specified
            $varieties = $query->orderBy('varietyId', 'desc')->paginate($pageSize);
        } else {
            // Return all results if no pageSize is specified
            $varieties = $query->orderBy('varietyId', 'desc')->get();
        }

        // Return varieties as JSON response
        return response()->json($varieties, 200);
    }


    // Store a new crop variety
    public function store(Request $request)
    {
        // Validate the input data
        $request->validate([
            'cropId' => 'required|exists:crops,cropId',  // Ensure cropId exists in the crops table
            'varietyName' => 'required|string',
            'color' => 'nullable|string',
            'size' => 'nullable|string',
            'flavor' => 'nullable|string',
            'growthConditions' => 'nullable|string',
            'pestDiseaseResistance' => 'nullable|string',
            'recommendedPractices' => 'nullable|string',
            'cropImg' => 'nullable|string',  // Optional image URL or path
        ]);

        // Create a new crop variety
        $cropVariety = new CropVariety([
            'cropId' => $request->input('cropId'),
            'varietyName' => $request->input('varietyName'),
            'color' => $request->input('color'),
            'size' => $request->input('size'),
            'flavor' => $request->input('flavor'),
            'growthConditions' => $request->input('growthConditions'),
            'pestDiseaseResistance' => $request->input('pestDiseaseResistance'),
            'recommendedPractices' => $request->input('recommendedPractices'),
            'cropImg' => $request->input('cropImg'),
        ]);

        $cropVariety->save();

        return response()->json($cropVariety, 201);
    }

    // Show details of a specific crop variety by ID
    public function show($id)
    {
        $variety = CropVariety::with('crop')->findOrFail($id); // Include the related crop details
        return response()->json($variety, 200);
    }

    // Update a specific crop variety by ID
    public function update(Request $request, $id)
    {
        // Find variety by ID
        $cropVariety = CropVariety::findOrFail($id);

        // Validate the input data
        $request->validate([
            'cropId' => 'required|exists:crops,cropId',
            'varietyName' => 'required|string',
            'color' => 'nullable|string',
            'size' => 'nullable|string',
            'flavor' => 'nullable|string',
            'growthConditions' => 'nullable|string',
            'pestDiseaseResistance' => 'nullable|string',
            'recommendedPractices' => 'nullable|string',
            'cropImg' => 'nullable|string',
        ]);

        // Update the crop variety attributes
        $cropVariety->fill($request->only([
            'cropId', 'varietyName', 'color', 'size',
            'flavor', 'growthConditions', 'pestDiseaseResistance',
            'recommendedPractices', 'cropImg'
        ]));

        $cropVariety->save();

        return response()->json($cropVariety, 200);
    }

    // Delete a crop variety by ID
    public function destroy($id)
    {
        $cropVariety = CropVariety::find($id);
        if ($cropVariety) {
            $cropVariety->delete();
            return response()->json(null, 204);
        } else {
            return response()->json(['message' => 'Crop variety not found'], 404);
        }
    }

    // Get varieties by cropId
    public function getVarietiesByCrop($cropId)
    {
        $varieties = CropVariety::where('cropId', $cropId)->get();

        if ($varieties->isEmpty()) {
            return response()->json(['message' => 'No varieties found for this crop'], 404);
        }

        return response()->json($varieties, 200);
    }
}
