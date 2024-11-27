<?php

namespace App\Http\Controllers;

use App\Models\DamageReport;
use Illuminate\Http\Request;

class DamageReportController extends Controller
{
    public function index(Request $request)
    {
        // Get the search term, page size, and current page from the request
        $searchTerm = $request->query('search'); // Search term for filtering damage reports
        $pageSize = $request->query('pageSize', 10); // Default page size of 10 if not provided
        $page = $request->query('page', 1); // Current page, default to 1 if not provided

        // Build the query to retrieve damage reports
        $query = DamageReport::query();

        // Apply search filter if a search term is provided
        if ($searchTerm) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('barangay', 'like', "%$searchTerm%")
                    ->orWhere('cropName', 'like', "%$searchTerm%")
                    ->orWhere('variety', 'like', "%$searchTerm%")
                    ->orWhere('numberOfFarmers', 'like', "%$searchTerm%")
                    ->orWhere('areaAffected', 'like', "%$searchTerm%")
                    ->orWhere('yieldLoss', 'like', "%$searchTerm%")
                    ->orWhere('grandTotalValue', 'like', "%$searchTerm%")
                    ->orWhere('season', 'like', "%$searchTerm%")
                    ->orWhere('monthYear', 'like', "%$searchTerm%");
            });
        }

        // If no page or search term is provided, return all damage reports without pagination
        if (!$pageSize && !$searchTerm) {
            // Return all damage reports if no pagination or search term is provided
            $damageReports = $query->orderBy('damageId', 'desc')->get(); // Fetch all records without pagination
            return response()->json($damageReports, 200);
        }

        // Apply pagination if page and search term are provided
        $damageReports = $query->orderBy('damageId', 'desc')
            ->paginate($pageSize, ['*'], 'page', $page);

        return response()->json($damageReports, 200);
    }


    public function store(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'recordId' => 'required|exists:records,recordId',
            'barangay' => 'required|string|max:255',
            'cropName' => 'required|string|max:255',
            'variety' => 'nullable|string|max:255',
            'numberOfFarmers' => 'required|integer',
            'areaAffected' => 'required|numeric',
            'yieldLoss' => 'required|numeric',
            'grandTotalValue' => 'required|numeric',
            'season' => 'required|string|max:255',
            'monthYear' => 'required|string|max:255',
        ]);

        // If validation passes, create a new damage report record
        $damageReport = new DamageReport([
            'recordId' => $request->input('recordId'),
            'barangay' => $request->input('barangay'),
            'cropName' => $request->input('cropName'),
            'variety' => $request->input('variety'),
            'numberOfFarmers' => $request->input('numberOfFarmers'),
            'areaAffected' => $request->input('areaAffected'),
            'yieldLoss' => $request->input('yieldLoss'),
            'grandTotalValue' => $request->input('grandTotalValue'),
            'season' => $request->input('season'),
            'monthYear' => $request->input('monthYear'),
        ]);

        // Save the damage report record to the database
        $damageReport->save();

        // Return a JSON response with the created damage report data and status code 201 (Created)
        return response()->json($damageReport, 201);
    }

    public function storeBatch(Request $request)
    {
        $damageDataArray = $request->input('damageData');

        // Process and store each item in the validated data
        foreach ($damageDataArray as $damageData) {
            $request->validate([
                'damageData.*.recordId' => 'required|exists:records,recordId',
                'damageData.*.barangay' => 'required|string|max:255',
                'damageData.*.cropName' => 'required|string|max:255',
                'damageData.*.variety' => 'nullable|string|max:255',
                'damageData.*.numberOfFarmers' => 'required|integer',
                'damageData.*.areaAffected' => 'required|numeric',
                'damageData.*.yieldLoss' => 'required|numeric',
                'damageData.*.grandTotalValue' => 'required|numeric',
                'damageData.*.season' => 'required|string|max:255',
                'damageData.*.monthYear' => 'required|string|max:255',
            ]);

            DamageReport::create(
                [
                    'recordId' => $damageData['recordId'],
                    'barangay' => $damageData['barangay'],
                    'cropName' => $damageData['cropName'],
                    'variety' => $damageData['variety'],
                    'numberOfFarmers' => $damageData['numberOfFarmers'],
                    'areaAffected' => $damageData['areaAffected'],
                    'yieldLoss' => $damageData['yieldLoss'],
                    'grandTotalValue' => $damageData['grandTotalValue'],
                    'season' => $damageData['season'],
                    'monthYear' => $damageData['monthYear']
                ]
            );
        }

        return response()->json(['message' => 'Batch data stored successfully']);
    }

    public function destroy($id)
    {
        // Find the specific damage report record by its ID
        $damageReport = DamageReport::findOrFail($id);

        // Delete the damage report record from the database
        $damageReport->delete();

        // Return a JSON response with status code 204 (No Content)
        return response()->json(null, 204);
    }

    public function destroyBatch(Request $request)
    {
        // Retrieve the array of records from the request
        $damageDataArray = $request->input('damageData');

        // Check if the input is an array and not empty
        if (!is_array($damageDataArray) || empty($damageDataArray)) {
            return response()->json(['error' => 'Invalid input'], 400);
        }

        // Extract foreign keys (damageIds) from the damage data array
        $foreignKeys = array_column($damageDataArray, 'damageId');

        // Validate that foreign keys are properly extracted
        if (empty($foreignKeys)) {
            return response()->json(['error' => 'No valid foreign keys found'], 400);
        }

        // Find the primary keys of records in the DamageReport table that match the foreign keys
        $recordsToDelete = DamageReport::whereIn('damageId', $foreignKeys)->pluck('damageId');

        // Ensure that we have valid records to delete
        if ($recordsToDelete->isEmpty()) {
            return response()->json(['error' => 'No records found to delete'], 404);
        }

        // Delete the records from the database
        DamageReport::whereIn('damageId', $recordsToDelete)->delete();

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
        $records = DamageReport::where('recordId', $request->input('recordId'))->get();

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
