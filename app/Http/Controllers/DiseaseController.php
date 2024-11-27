<?php

namespace App\Http\Controllers;

use App\Models\Disease;
use Illuminate\Http\Request;

class DiseaseController extends Controller
{
    public function index(Request $request)
    {
        // Get the search term, page size, and current page from the request
        $searchTerm = $request->query('search'); // Search term for filtering diseases
        $pageSize = $request->query('pageSize');
        $page = $request->query('page', 1); // Current page, default to 1 if not provided

        // Build the query to retrieve disease reports
        $query = Disease::query();

        // Apply search filter if a search term is provided
        if ($searchTerm) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('barangay', 'like', "%$searchTerm%")
                    ->orWhere('cropName', 'like', "%$searchTerm%")
                    ->orWhere('diseaseName', 'like', "%$searchTerm%")
                    ->orWhere('totalPlanted', 'like', "%$searchTerm%")
                    ->orWhere('totalAffected', 'like', "%$searchTerm%")
                    ->orWhere('season', 'like', "%$searchTerm%")
                    ->orWhere('monthYear', 'like', "%$searchTerm%");
            });
        }

        // If no page or search term is provided, return all disease reports without pagination
        if (!$pageSize) {
            // Return all disease reports if no pagination or search term is provided
            $diseaseReports = $query->orderBy('diseaseId', 'desc')->get(); // Fetch all records without pagination
            return response()->json($diseaseReports, 200);
        }

        // Apply pagination if page and search term are provided
        $diseaseReports = $query->orderBy('diseaseId', 'desc')
            ->paginate($pageSize, ['*'], 'page', $page);

        return response()->json($diseaseReports, 200);
    }


    public function store(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'recordId' => 'required|exists:records,recordId',
            'barangay' => 'required|string|max:255',
            'cropName' => 'required|string|max:255',
            'diseaseName' => 'required|string|max:255',
            'totalPlanted' => 'required|numeric',
            'totalAffected' => 'required|numeric',
            'season' => 'required|string|max:255',
            'monthYear' => 'required|string|max:255',
        ]);

        // If validation passes, create a new disease record
        $disease = new Disease([
            'recordId' => $request->input('recordId'),
            'barangay' => $request->input('barangay'),
            'cropName' => $request->input('cropName'),
            'diseaseName' => $request->input('diseaseName'),
            'totalPlanted' => $request->input('totalPlanted'),
            'totalAffected' => $request->input('totalAffected'),
            'season' => $request->input('season'),
            'monthYear' => $request->input('monthYear'),
        ]);

        // Save the disease record to the database
        $disease->save();

        // Return a JSON response with the created disease data and status code 201 (Created)
        return response()->json($disease, 201);
    }

    public function storeBatch(Request $request)
    {
        $diseaseDataArray = $request->input('diseaseData');

        // If $diseaseDataArray is empty or not present, skip processing and return
        if (empty($diseaseDataArray)) {
            return response()->json(['message' => 'No data to process']);
        }

        // Process and store each item in the validated data
        foreach ($diseaseDataArray as $diseaseData) {
            $request->validate([
                'diseaseData.*.recordId' => 'required|exists:records,recordId',
                'diseaseData.*.barangay' => 'required|string|max:255',
                'diseaseData.*.cropName' => 'required|string|max:255',
                'diseaseData.*.diseaseName' => 'required|string|max:255',
                'diseaseData.*.totalPlanted' => 'required|numeric',
                'diseaseData.*.totalAffected' => 'required|numeric',
                'diseaseData.*.season' => 'required|string|max:255',
                'diseaseData.*.monthYear' => 'required|string|max:255',
            ]);

            Disease::create(
                [
                    'recordId' => $diseaseData['recordId'],
                    'barangay' => $diseaseData['barangay'],
                    'cropName' => $diseaseData['cropName'],
                    'diseaseName' => $diseaseData['diseaseName'],
                    'totalPlanted' => $diseaseData['totalPlanted'],
                    'totalAffected' => $diseaseData['totalAffected'],
                    'season' => $diseaseData['season'],
                    'monthYear' => $diseaseData['monthYear'],
                ],
            );
        }

        return response()->json(['message' => 'Batch data stored successfully']);
    }

    public function destroy($id)
    {
        // Find the specific disease record by its ID
        $disease = Disease::findOrFail($id);

        // Delete the disease record from the database
        $disease->delete();

        // Return a JSON response with status code 204 (No Content)
        return response()->json(null, 204);
    }

    public function destroyBatch(Request $request)
    {
        // Retrieve the array of records from the request
        $diseaseDataArray = $request->input('diseaseData');

        // Check if the input is an array and not empty
        if (!is_array($diseaseDataArray) || empty($diseaseDataArray)) {
            return response()->json(['error' => 'Invalid input'], 400);
        }

        // Extract foreign keys (recordIds) from the disease data array
        $foreignKeys = array_column($diseaseDataArray, 'recordId');

        // Validate that foreign keys are properly extracted
        if (empty($foreignKeys)) {
            return response()->json(['error' => 'No valid foreign keys found'], 400);
        }

        // Find the primary keys of records in the Disease table that match the foreign keys
        $recordsToDelete = Disease::whereIn('recordId', $foreignKeys)->pluck('diseaseId');

        // Ensure that we have valid records to delete
        if ($recordsToDelete->isEmpty()) {
            return response()->json(['error' => 'No records found to delete'], 404);
        }

        // Delete the records from the database
        Disease::whereIn('diseaseId', $recordsToDelete)->delete();

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
        $records = Disease::where('recordId', $request->input('recordId'))->get();

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
