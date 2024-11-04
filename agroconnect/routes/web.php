<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\TrimTrailingSlashes;

Route::get('/', function () {
    return view('index');
})->name('index');

Route::get('/seasonal-trends', function () {
    return view('components.pages.seasonaltrends');
})->name('seasonal-trends');

// Redirect any extra characters to the clean route
Route::get('/seasonal-trends{any?}', function () {
    return redirect()->route('seasonal-trends');
})->where('any', '.*');

// Standard Pages
Route::get('/top-crops', function () {
    return view('components.pages.topcrops'); // Ensure topcrops.blade.php exists
})->name('top-crops');

// Redirect any extra characters to the clean route
Route::get('/top-crops{any?}', function () {
    return redirect()->route('top-crops');
})->where('any', '.*');

Route::get('/map-trends', function () {
    return view('components.pages.maptrends');
})->name('map-trends');

// Redirect any extra characters to the clean route
Route::get('/map-trends{any?}', function () {
    return redirect()->route('map-trends');
})->where('any', '.*');

Route::get('/soil-health', function () {
    return view('components.pages.soilhealth');
})->name('soil-health');

// Redirect any extra characters to the clean route
Route::get('/soil-health{any?}', function () {
    return redirect()->route('soil-health');
})->where('any', '.*');

Route::get('/weather-forecast', function () {
    return view('components.pages.weatherforecast');
})->name('weather-forecast');

// Redirect any extra characters to the clean route
Route::get('/weather-forecast{any?}', function () {
    return redirect()->route('weather-forecast');
})->where('any', '.*');

Route::get('/contact-us', function () {
    return view('components.pages.contact');
})->name('contact-us');

// Redirect any extra characters to the clean route
Route::get('/contact-us{any?}', function () {
    return redirect()->route('contact-us');
})->where('any', '.*');

// Print Pages
Route::get('/print-seasonal-trends', function () {
    return view('components.print.seasonalTrends');
})->name('print-seasonal-trends');

// Redirect any extra characters to the clean route
Route::get('/print-seasonal-trends{any?}', function () {
    return redirect()->route('print-seasonal-trends');
})->where('any', '.*');

Route::get('/print-soil-health', function () {
    return view('components.print.soilHealth');
})->name('print-soil-health');

// Redirect any extra characters to the clean route
Route::get('/print-soil-health{any?}', function () {
    return redirect()->route('print-soil-health');
})->where('any', '.*');

Route::get('/print-map-trends', function () {
    return view('components.print.mapTrends');
})->name('print-map-trends');

// Redirect any extra characters to the clean route
Route::get('/print-map-trends{any?}', function () {
    return redirect()->route('print-map-trends');
})->where('any', '.*');

Route::get('/management/admin', function () {
    return view('management.admin.index');
})->name('admin');

Route::get('/management/agriculturist', function () {
    return view('management.agriculturist.index');
})->name('agriculturist');

Route::get('/management/logindas', function () {
    return view('management.login.index');
})->name('login');

Route::middleware([TrimTrailingSlashes::class])->group(function () {
    Route::get('/greet/me', function () {
        return view('greet');
    });
});
