<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\Concern;
use App\Models\DamageReport;
use App\Models\Record;
use App\Models\Production;
use App\Models\Price;
use App\Models\Pest;
use App\Models\Disease;
use App\Models\Download;
use App\Models\Farmer;
use App\Models\RiceProduction;
use App\Models\SoilHealth;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class RecordController extends Controller
{
    public function index(Request $request)
    {
        // Get the query parameters
        $pageSize = $request->query('pageSize'); // Default page size is not provided
        $recordName = $request->query('recordName'); // Optional record name filter
        $userId = $request->query('userId'); // Optional user ID filter
        $userRole = $request->query('userRole', 'admin'); // Default user role is 'admin'

        // Build the query
        $query = Record::query();

        // If recordName is provided, filter by it
        if ($recordName) {
            $query->where('nameString', 'like', "%$recordName%");
        }

        // If userRole is not 'admin' and userId is provided, filter by userId
        if ($userRole !== 'admin' && $userId) {
            $query->where('userId', $userId);
        }

        // If pageSize is provided, paginate the results; otherwise, return all records
        if ($pageSize) {
            // Paginate the results if pageSize is specified
            $records = $query->orderBy('recordId', 'desc')->paginate($pageSize);
        } else {
            // Return all records if pageSize is not specified
            $records = $query->orderBy('recordId', 'desc')->get();
        }

        // Return the records as a JSON response
        return response()->json($records, 200);
    }


    public function getYearRange(Request $request)
    {
        // Get the model type from the request, if provided
        $model = $request->query('model');

        // If no model is provided, we need to find the one with the highest year range
        if (!$model) {
            // Array of model names
            $models = ['RiceProduction', 'Production', 'Price', 'Pest', 'Disease', 'DamageReport', 'SoilHealth'];

            $maxRange = 0; // Track the highest year range
            $bestModel = ''; // Track the model with the highest range

            // Iterate over models to find the one with the highest year range
            foreach ($models as $model) {
                // Get the data for the model
                $data = $this->getDataForModel($model);

                // If there is data, calculate the year range
                if ($data) {
                    // Check if the model is RiceProduction or another model
                    if ($model === 'RiceProduction') {
                        // Extract only the year from RiceProduction
                        $years = $data->map(function ($item) {
                            return isset($item->year) ? (int)$item->year : null; // Only use the year field
                        })->filter()->toArray();
                    } else {
                        // For all other models, use monthYear to extract the year
                        $years = $data->map(function ($item) {
                            preg_match('/\d{4}$/', $item->monthYear, $matches);
                            return $matches ? (int)$matches[0] : null;
                        })->filter()->toArray();
                    }

                    // Calculate the range for this model
                    if (count($years) > 0) {
                        $minYear = min($years);
                        $maxYear = max($years);
                        $range = $maxYear - $minYear;

                        // Check if this model has the largest range
                        if ($range > $maxRange) {
                            $maxRange = $range;
                            $bestModel = $model;
                        }
                    }
                }
            }

            // If no model with data is found, return "N/A"
            if (!$bestModel) {
                return response()->json(['error' => 'No valid data available'], 400);
            }

            // If a model with the highest range is found, fetch the data for that model
            $model = $bestModel;
        }

        // Get data for the selected model
        $data = $this->getDataForModel($model);

        // Process the data based on the model type
        if ($model === 'RiceProduction') {
            // Extract only the year from RiceProduction
            $years = $data->map(function ($item) {
                return isset($item->year) ? (int)$item->year : null; // Only use the year field
            })->filter()->toArray();
        } else {
            // For all other models, use monthYear to extract the year
            $years = $data->map(function ($item) {
                preg_match('/\d{4}$/', $item->monthYear, $matches);
                return $matches ? (int)$matches[0] : null;
            })->filter()->toArray();
        }

        if (count($years) === 0) {
            return response()->json('N/A', 200);
        }

        $minYear = min($years);
        $maxYear = max($years);

        // Return the year range
        return response()->json($minYear === $maxYear ? "$minYear" : "$minYear to $maxYear", 200);
    }


    // Helper method to fetch data for a given model
    private function getDataForModel($model)
    {
        switch ($model) {
            case 'RiceProduction':
                return RiceProduction::all();
            case 'Production':
                return Production::all();
            case 'Price':
                return Price::all();
            case 'Pest':
                return Pest::all();
            case 'Disease':
                return Disease::all();
            case 'DamageReport':
                return DamageReport::all();
            case 'SoilHealth':
                return SoilHealth::all();
            default:
                return null;
        }
    }

    public function getDataEntriesCount()
    {
        return RiceProduction::count() + Production::count() + Price::count()
            + Pest::count() + Disease::count() + DamageReport::count();
    }

    public function getFarmerCount()
    {
        return Farmer::count();
    }

    public function getRecordCount()
    {
        return Record::count();
    }

    public function getBarangayCount()
    {
        return Barangay::count();
    }

    public function getUserCount()
    {
        return User::count();
    }

    public function getDownloadCount()
    {
        return Download::count();
    }

    public function getConcernCount()
    {
        return Concern::count();
    }



    public function indexByType(Request $request, $dataType)
    {
        $pageSize = $request->query('pageSize', 10); // Default page size
        $recordName = $request->query('recordName'); // Optional record name filter
        $userRole = $request->query('userRole'); // User role
        $userId = $request->query('userId'); // User ID

        // Build the query
        $query = Record::query();

        // Filter by dataType
        $query->where('type', $dataType);

        // If userRole is not 'admin', filter by userId
        if ($userRole !== 'admin' && $userId) {
            $query->where('userId', $userId);
        }

        if ($recordName) {
            // Filter by record name
            $query->where('name', 'like', "%$recordName%");
        }

        // Paginate results
        $records = $query->orderBy('recordId', 'desc')->paginate($pageSize);

        // Add file size to each record
        $records->getCollection()->transform(function ($record) {
            if (!empty($record->fileRecord)) {
                $base64String = $record->fileRecord;
                $bytes = (strlen($base64String) * 3) / 4 -
                    (substr($base64String, -2) === '==' ? 2 : (substr($base64String, -1) === '=' ? 1 : 0));
                $kiloBytes = $bytes / 1024;
                $megaBytes = $kiloBytes / 1024;

                $record->fileSize = $megaBytes >= 1
                    ? round($megaBytes, 2) . ' MB'
                    : round($kiloBytes, 2) . ' KB';
            } else {
                $record->fileSize = 'N/A';
            }

            return $record;
        });

        // Preserve search and page size parameters in pagination links
        $records->appends([
            'recordName' => $recordName,
            'pageSize' => $pageSize,
            'userRole' => $userRole,
            'userId' => $userId,
        ]);

        // Return records as JSON response
        return response()->json($records, 200);
    }

    public function store(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'userId' => 'required|exists:users,userId',
            'name' => 'required|string|max:255',
            'season' => 'required|string|max:255',
            'monthYear' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'fileRecord' => 'required|string',
        ]);


        // Accessing input data using $request->input('fieldName')
        $record = new Record([
            'userId' => $request->input('userId'),
            'name' => $request->input('name'),
            'season' => $request->input('season'),
            'monthYear' => $request->input('monthYear'),
            'type' => $request->input('type'),
            'fileRecord' => $request->input('fileRecord'),
        ]);

        $record->save();

        return response()->json($record, 201);
    }

    public function show($id)
    {
        $record = Record::findOrFail($id);
        return response()->json($record);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'userId' => 'exists:users,userId',
            'name' => 'string|max:255',
            'season' => 'string|max:255',
            'monthYear' => 'string|max:255',
            'type' => 'string|max:255',
            'fileRecord' => 'nullable|string', // Allow fileRecord to be nullable and string
        ]);

        $record = Record::findOrFail($id);

        // Update record attributes except for 'fileRecord'
        $record->fill($request->except('fileRecord'));

        // Check if 'fileRecord' has a value and update it
        if ($request->has('fileRecord') && !empty($request->fileRecord)) {
            $record->fileRecord = $request->fileRecord;
        }

        // Save updated record to the database
        $record->save();

        // Return JSON response with the updated record and status code 200 (OK)
        return response()->json($record, 200);
    }

    public function destroy($id)
    {
        // Start a database transaction to ensure atomicity
        DB::beginTransaction();

        try {
            // Find the record by ID
            $record = Record::findOrFail($id);

            // Check the type of the record
            if ($record->type === 'production') {
                // Delete associated records from the Production table
                Production::where('recordId', $id)->delete();
            } else if ($record->type === 'riceProduction') {
                // Delete associated records from the Price table
                RiceProduction::where('recordId', $id)->delete();
            } else if ($record->type === 'price') {
                // Delete associated records from the Price table
                Price::where('recordId', $id)->delete();
            } else if ($record->type === 'pestDisease') {
                // Delete associated records from the Price table
                Pest::where('recordId', $id)->delete();
                Disease::where('recordId', $id)->delete();
            } else if ($record->type === 'soilHealth') {
                // Delete associated records from the Price table
                SoilHealth::where('recordId', $id)->delete();
            } else if ($record->type === 'damage') {
                // Delete associated records from the Price table
                DamageReport::where('recordId', $id)->delete();
            }

            // Delete the record itself
            $record->delete();

            // Commit the transaction
            DB::commit();

            return response()->json(null, 204);
        } catch (\Exception $e) {
            // Rollback the transaction if something goes wrong
            DB::rollBack();

            // Return a JSON response with status code 500 (Internal Server Error)
            return response()->json(['error' => 'Failed to delete record'], 500);
        }
    }
}
