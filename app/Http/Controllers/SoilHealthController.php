<?php

namespace App\Http\Controllers;

use App\Models\SoilHealth;
use Illuminate\Http\Request;

class SoilHealthController extends Controller
{
    public function index(Request $request)
    {
        // Get the search term, page size, and current page from the request
        $searchTerm = $request->query('search'); // Search term for filtering soil health records
        $pageSize = $request->query('pageSize'); // Page size, if not provided will default to all records
        $page = $request->query('page', 1); // Current page, default to 1 if not provided

        // Build the query to retrieve soil health records
        $query = SoilHealth::query();

        // Apply search filter if a search term is provided
        if ($searchTerm) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('barangay', 'like', "%$searchTerm%")
                    ->orWhere('farmer', 'like', "%$searchTerm%")
                    ->orWhere('fieldType', 'like', "%$searchTerm%")
                    ->orWhere('nitrogenContent', 'like', "%$searchTerm%")
                    ->orWhere('phosphorusContent', 'like', "%$searchTerm%")
                    ->orWhere('potassiumContent', 'like', "%$searchTerm%")
                    ->orWhere('pH', 'like', "%$searchTerm%")
                    ->orWhere('generalRating', 'like', "%$searchTerm%")
                    ->orWhere('recommendations', 'like', "%$searchTerm%")
                    ->orWhere('season', 'like', "%$searchTerm%")
                    ->orWhere('monthYear', 'like', "%$searchTerm%");
            });
        }

        // If no pageSize is provided, return all records
        if (!$pageSize) {
            $soilHealths = $query->orderBy('soilHealthId', 'desc')->get(); // Get all records
        } else {
            // If pageSize is provided, apply pagination
            $soilHealths = $query->orderBy('soilHealthId', 'desc')
                ->paginate($pageSize, ['*'], 'page', $page);
        }

        return response()->json($soilHealths, 200);
    }


    public function store(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'recordId' => 'required|exists:records,recordId',
            'barangay' => 'required|string|max:255',
            'farmer' => 'required|string|max:255',
            'fieldType' => 'required|string|max:255',
            'nitrogenContent' => 'required|string|max:2',
            'phosphorusContent' => 'required|string|max:2',
            'potassiumContent' => 'required|string|max:2',
            'pH' => 'required|string|max:2',
            'generalRating' => 'required|string|max:2',
            'recommendations' => 'required|string|max:255',
            'season' => 'required|string|max:255',
            'monthYear' => 'required|string|max:255',
        ]);

        // If validation passes, create a new soilHealth record
        $soilHealth = new SoilHealth([
            'recordId' => $request->input('recordId'),
            'barangay' => $request->input('barangay'),
            'farmer' => $request->input('farmer'),
            'fieldType' => $request->input('fieldType'),
            'nitrogenContent' => $request->input('nitrogenContent'),
            'phosphorusContent' => $request->input('phosphorusContent'),
            'potassiumContent' => $request->input('potassiumContent'),
            'pH' => $request->input('pH'),
            'generalRating' => $request->input('generalRating'),
            'recommendations' => $request->input('recommendations'),
            'season' => $request->input('season'),
            'monthYear' => $request->input('monthYear'),
        ]);

        // Save the soilHealth record to the database
        $soilHealth->save();

        // Return a JSON response with the created soilHealth data and status code 201 (Created)
        return response()->json($soilHealth, 201);
    }

    public function storeBatch(Request $request)
    {
        $soilHealthDataArray = $request->input('soilHealthData');

        // Process and store each item in the validated data
        foreach ($soilHealthDataArray as $soilHealthData) {
            $request->validate([
                'soilHealthData.*.recordId' => 'required|exists:records,recordId',
                'soilHealthData.*.barangay' => 'required|string|max:255',
                'soilHealthData.*.farmer' => 'required|string|max:255',
                'soilHealthData.*.fieldType' => 'required|string|max:255',
                'soilHealthData.*.nitrogenContent' => 'required|string|max:2',
                'soilHealthData.*.phosphorusContent' => 'required|string|max:2',
                'soilHealthData.*.potassiumContent' => 'required|string|max:2',
                'soilHealthData.*.pH' => 'required|string|max:2',
                'soilHealthData.*.generalRating' => 'required|string|max:2',
                'soilHealthData.*.recommendations' => 'required|string|max:255',
                'soilHealthData.*.season' => 'required|string|max:50',
                'soilHealthData.*.monthYear' => 'required|string|max:255',
            ]);
            SoilHealth::create(
                [
                    'recordId' => $soilHealthData['recordId'],
                    'barangay' => $soilHealthData['barangay'],
                    'farmer' => $soilHealthData['barangay'],
                    'fieldType' => $soilHealthData['fieldType'],
                    'nitrogenContent' => $soilHealthData['nitrogenContent'],
                    'phosphorusContent' => $soilHealthData['phosphorusContent'],
                    'potassiumContent' => $soilHealthData['potassiumContent'],
                    'pH' => $soilHealthData['pH'],
                    'generalRating' => $soilHealthData['generalRating'],
                    'recommendations' => $soilHealthData['recommendations'],
                    'season' => $soilHealthData['season'],
                    'monthYear' => $soilHealthData['monthYear']
                ]
            );
        }

        return response()->json(['message' => 'Batch data stored successfully']);
    }

    public function destroy($id)
    {
        // Find the specific soilHealth record by its ID
        $soilHealth = SoilHealth::findOrFail($id);

        // Delete the soilHealth record from the database
        $soilHealth->delete();

        // Return a JSON response with status code 204 (No Content)
        return response()->json(null, 204);
    }

    public function destroyBatch(Request $request)
    {
        // Retrieve the array of records from the request
        $soilHealthDataArray = $request->input('soilHealthData');

        // Check if the input is an array and not empty
        if (!is_array($soilHealthDataArray) || empty($soilHealthDataArray)) {
            return response()->json(['error' => 'Invalid input'], 400);
        }

        // Extract foreign keys (recordIds) from the soilHealth data array
        $foreignKeys = array_column($soilHealthDataArray, 'recordId');

        // Validate that foreign keys are properly extracted
        if (empty($foreignKeys)) {
            return response()->json(['error' => 'No valid foreign keys found'], 400);
        }

        // Find the primary keys of records in the SoilHealth table that match the foreign keys
        $recordsToDelete = SoilHealth::whereIn('recordId', $foreignKeys)->pluck('soilHealthId');

        // Ensure that we have valid records to delete
        if ($recordsToDelete->isEmpty()) {
            return response()->json(['error' => 'No records found to delete'], 404);
        }

        // Delete the records from the database
        SoilHealth::whereIn('soilHealthId', $recordsToDelete)->delete();

        // Return a JSON response with status code 204 (No Content)
        return response()->json(null, 204);
    }

    public function updateMonthYear(Request $request)
    {
        // Validate request data
        $request->validate([
            'recordId' => 'required|integer',
            'monthYear' => 'required|string',  // The new value for monthYear
            'season' => 'required|string',
        ]);

        // Find all records with the given recordId
        $records = SoilHealth::where('recordId', $request->input('recordId'))->get();

        // Check if records were found
        if ($records->isEmpty()) {
            return response()->json(['message' => 'No records found with the provided recordId'], 404);
        }

        // Update the monthYear for all matching records
        foreach ($records as $record) {
            $record->monthYear = $request->input('monthYear');
            $record->season = $request->input('season');
            $record->save();
        }

        // Return a success response
        return response()->json(['message' => 'MonthYear updated successfully'], 200);
    }
}
