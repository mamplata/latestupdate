<?php

namespace App\Http\Controllers;

use App\Models\Production;
use App\Models\Crop;
use Illuminate\Http\Request;

class ProductionController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search'); // Search query
        $pageSize = $request->query('pageSize', null); // Page size, default to null if not provided
        $page = $request->query('page', 1); // Current page

        $query = Production::query();

        // Apply search filter if provided
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('barangay', 'like', "%$search%")
                    ->orWhere('cropName', 'like', "%$search%")
                    ->orWhere('variety', 'like', "%$search%")
                    ->orWhere('areaPlanted', 'like', "%$search%")
                    ->orWhere('monthPlanted', 'like', "%$search%")
                    ->orWhere('monthHarvested', 'like', "%$search%")
                    ->orWhere('volumeProduction', 'like', "%$search%")
                    ->orWhere('productionCost', 'like', "%$search%")
                    ->orWhere('price', 'like', "%$search%")
                    ->orWhere('volumeSold', 'like', "%$search%")
                    ->orWhere('season', 'like', "%$search%")
                    ->orWhere('monthYear', 'like', "%$search%");
            });
        }

        // If no search query and no pageSize is provided, return all records
        if (!$pageSize) {
            $productions = $query->orderBy('productionId', 'desc')->get(); // No pagination, return all results
        } else {
            // Apply pagination if search query or pageSize is provided
            $productions = $query->orderBy('productionId', 'desc')
                ->paginate($pageSize ?: 10, ['*'], 'page', $page); // Default pageSize to 10 if not provided
        }

        return response()->json($productions, 200);
    }


    public function store(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'recordId' => 'required|exists:records,recordId',
            'barangay' => 'required|string|max:255',
            'cropName' => 'required|string|max:255',
            'variety' => 'required|string|max:255',
            'areaPlanted' => 'required|numeric',
            'monthPlanted' => 'required|string|max:255',
            'monthHarvested' => 'required|string|max:255',
            'volumeProduction' => 'required|numeric',
            'productionCost' => 'required|numeric',
            'price' => 'required|string|max:255',
            'volumeSold' => 'required|numeric',
            'season' => 'required|string|max:255',
            'monthYear' => 'required|string|max:255',
        ]);

        // If validation passes, create a new production record
        $production = new Production([
            'recordId' => $request->input('recordId'),
            'barangay' => $request->input('barangay'),
            'cropName' => $request->input('cropName'),
            'variety' => $request->input('variety'),
            'areaPlanted' => $request->input('areaPlanted'),
            'monthPlanted' => $request->input('monthPlanted'),
            'monthHarvested' => $request->input('monthHarvested'),
            'volumeProduction' => $request->input('volumeProduction'),
            'productionCost' => $request->input('productionCost'),
            'price' => $request->input('price'),
            'volumeSold' => $request->input('volumeSold'),
            'season' => $request->input('season'),
            'monthYear' => $request->input('monthYear'),
        ]);

        // Save the production record to the database
        $production->save();

        // Return a JSON response with the created production data and status code 201 (Created)
        return response()->json($production, 201);
    }

    public function storeBatch(Request $request)
    {
        $productionDataArray = $request->input('productionData');

        // Process and store each item in the validated data
        foreach ($productionDataArray as $productionData) {
            $request->validate([
                'productionData.*.recordId' => 'required|exists:records,recordId',
                'productionData.*.recordId' => 'required|exists:records,recordId',
                'productionData.*.barangay' => 'required|string|max:255',
                'productionData.*.cropName' => 'required|string|max:255',
                'productionData.*.variety' => 'nullable|string|max:255',
                'productionData.*.areaPlanted' => 'required|numeric',
                'productionData.*.monthPlanted' => 'required|string|max:50',
                'productionData.*.monthHarvested' => 'required|string|max:50',
                'productionData.*.volumeProduction' => 'required|numeric',
                'productionData.*.productionCost' => 'required|numeric',
                'productionData.*.volumeSold' => 'required|numeric',
                'productionData.*.price' => 'required|string|max:255',
                'productionData.*.season' => 'required|string|max:50',
                'productionData.*.monthYear' => 'required|string|max:255',
            ]);
            Production::create(
                [
                    'recordId' => $productionData['recordId'],
                    'barangay' => $productionData['barangay'],
                    'cropName' => $productionData['cropName'],
                    'variety' => $productionData['variety'] ?? '',
                    'areaPlanted' => $productionData['areaPlanted'],
                    'monthPlanted' => $productionData['monthPlanted'],
                    'monthHarvested' => $productionData['monthHarvested'],
                    'volumeProduction' => $productionData['volumeProduction'],
                    'productionCost' => $productionData['productionCost'],
                    'volumeSold' => $productionData['volumeSold'],
                    'price' => $productionData['price'],
                    'season' => $productionData['season'],
                    'monthYear' => $productionData['monthYear']
                ]
            );
        }

        return response()->json(['message' => 'Batch data stored successfully']);
    }

    public function destroy($id)
    {
        // Find the specific production record by its ID
        $production = Production::findOrFail($id);

        // Delete the production record from the database
        $production->delete();

        // Return a JSON response with status code 204 (No Content)
        return response()->json(null, 204);
    }

    public function destroyBatch(Request $request)
    {
        // Retrieve the array of records from the request
        $productionDataArray = $request->input('productionData');

        // Check if the input is an array and not empty
        if (!is_array($productionDataArray) || empty($productionDataArray)) {
            return response()->json(['error' => 'Invalid input'], 400);
        }

        // Extract foreign keys (recordIds) from the production data array
        $foreignKeys = array_column($productionDataArray, 'recordId');

        // Validate that foreign keys are properly extracted
        if (empty($foreignKeys)) {
            return response()->json(['error' => 'No valid foreign keys found'], 400);
        }

        // Find the primary keys of records in the Production table that match the foreign keys
        $recordsToDelete = Production::whereIn('recordId', $foreignKeys)->pluck('productionId');

        // Ensure that we have valid records to delete
        if ($recordsToDelete->isEmpty()) {
            return response()->json(['error' => 'No records found to delete'], 404);
        }

        // Delete the records from the database
        Production::whereIn('productionId', $recordsToDelete)->delete();

        // Return a JSON response with status code 204 (No Content)
        return response()->json(null, 204);
    }

    public function updateMonthYear(Request $request)
    {
        // Validate request data
        $request->validate([
            'recordId' => 'required|integer',
            'monthYear' => 'required|string',
            'season' => 'required|string',
        ]);

        // Find all records with the given recordId
        $records = Production::where('recordId', $request->input('recordId'))->get();

        // Check if records were found
        if ($records->isEmpty()) {
            return response()->json(['message' => 'No records found with the provided recordId'], 404);
        }

        // Update the monthYear and season for all matching records
        foreach ($records as $record) {
            $record->monthYear = $request->input('monthYear');
            $record->season = $request->input('season'); // Update the season field
            $record->save();
        }

        // Return a success response
        return response()->json(['message' => 'MonthYear and season updated successfully'], 200);
    }


    public function getTotalAreaPlanted($cropId, $variety)
    {
        // Fetch the cropName using the cropId from the Crop model
        $crop = Crop::find($cropId);

        // Check if the crop exists
        if (!$crop) {
            return response()->json([
                'error' => 'Crop not found',
            ], 404);
        }

        // Fetch total areaPlanted for the given cropName and variety
        $totalAreaPlanted = Production::where('cropName', $crop->cropName)
            ->where('variety', $variety)
            ->sum('areaPlanted');

        return response()->json([
            'cropId' => $cropId,
            'cropName' => $crop->cropName,
            'variety' => $variety,
            'totalAreaPlanted' => $totalAreaPlanted,
        ]);
    }
}
