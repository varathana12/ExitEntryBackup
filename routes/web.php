<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/*
 * Ajax request routes **********************************************
 */

Route::group(['prefix' => '/admin', 'middleware' => 'auth', 'as' => 'admin'], function () {

    Route::prefix('visitor')->group(function () {
        Route::post('', 'VisitorController@store');
        Route::put('', 'VisitorController@update');
        Route::get('last-id', 'VisitorController@getLastId');
        Route::get('get-all-visitors', 'VisitorController@getAllVisitors');
        Route::get('all', 'VisitorController@getAll');
        Route::get('is-existing-email', 'VisitorController@isExistingEmail');
        Route::delete('', 'VisitorController@destroy');
    });

    Route::prefix('entry-exit-info')->group(function () {
        Route::post('', 'EntryExitInfoController@store');
        Route::get('all', 'EntryExitInfoController@getAll');
        Route::get('get-in-hall-visitors', 'EntryExitInfoController@getInHallAdmin');
        Route::delete('', 'EntryExitInfoController@destroy');
        Route::post('entry_visitor', 'EntryExitInfoController@entryVisitor');
        Route::post('update_entry_visitor', 'EntryExitInfoController@updateEntryVisitor');
    });

    Route::prefix('reception-phone')->group(function () {
        Route::get('all', 'ReceptionPhoneController@getAll');
        Route::get('last-id', 'ReceptionPhoneController@getLastId');
        Route::post('', 'ReceptionPhoneController@store');
        Route::put('', 'ReceptionPhoneController@update');
        Route::delete('', 'ReceptionPhoneController@destroy');
    });

    Route::prefix('admin')->group(function () {
        Route::get('all', 'AdministratorController@getAll');
        Route::get('getAuth', 'AdministratorController@getAuth');
        Route::get('getEmail', 'AdministratorController@getEmail');
        Route::get('last-id', 'AdministratorController@getLastId');
        Route::get('getCompany', 'AdministratorController@getCompany');
        Route::post('updateToken', 'AdministratorController@updateToken');
        Route::get('is-existing-email', 'AdministratorController@isExistingEmail');

        Route::post('', 'AdministratorController@store');
        Route::put('', 'AdministratorController@update');
        Route::delete('', 'AdministratorController@destroy');

    });

    Route::prefix('exit-confirmer')->group(function () {
        Route::get('all', 'ExitConfirmerController@getAll');
        Route::post('', 'ExitConfirmerController@store');
        Route::put('', 'ExitConfirmerController@update');
        Route::get('last-id', 'ExitConfirmerController@getLastId');
        Route::delete('', 'ExitConfirmerController@destroy');
    });
});

Route::get('/messages', 'MessageController@index');
Route::get('/isResetEmail', 'AdministratorController@isResetEmails');

/**
 * Exit System's ajax routes
 */
Route::group(['prefix' => '/exit', 'middleware' => 'auth-token'], function () {
    Route::get('', function () {
        return response('Authenticated', '202');
    });
    Route::get('get-in-hall-visitors', 'EntryExitInfoController@getInHallVisitors');
    Route::post('specific_message', 'MessageController@specific_message');
    Route::get('confirmer', 'ExitConfirmerController@getConfirmer');
    Route::post('confirmed', 'ExitConfirmerController@confirmed');
    Route::post('register_confirmer', 'ExitConfirmerController@registerConfirmer');
});

/*
 * Entry System's ajax routes
 */
Route::group(['prefix' => '/entry', 'middleware' => 'auth-token'], function () {
    Route::get('', function () {
        return response('Authenticated', '202');
    });
    Route::prefix('visitor')->group(function () {
        Route::post('', 'VisitorController@store');
        Route::put('', 'VisitorController@update');
        Route::get('get', 'VisitorController@get');
        Route::get('get-all-emails', 'VisitorController@getAllEmails');
        Route::get('is-existing-email', 'VisitorController@isExistingEmail');
    });
    Route::prefix('entry-exit-info')->group(function () {
        Route::post('', 'EntryExitInfoController@store');
    });
    Route::prefix('reception-phone')->group(function () {
        Route::get('', 'ReceptionPhoneController@get');
    });
});

Route::get('/mail/preview', function () {
    $records = \App\EntryExitInformation::where(ENTRY_DATETIME, '>=', \Carbon\Carbon::yesterday())->get();
   return new App\Mail\ExitConfirmationOmission($records);
//    return new \App\Mail\BatchExceededTimeout();
});

/*
 * React app routes
 */
Route::prefix('/{usedCompanyId}')->group(function () {
    Route::get('entry/{any}', function () {
        return view('entry');
    })->where('any', '.*');
    Route::get('exit/{any}', function () {
        return view('exit');
    })->where('any', '.*');
});

Route::get('admin/{any}', function () {
    return view('admin');
})->where('any', '.*')->middleware('auth');

Auth::routes();
Route::prefix('/password/reset')->group(function () {
    Route::get('', 'ErrorController@Error404');
    Route::get('{token}', 'ResetPassword@showResetForm');
});


Route::get('reset/{any}', "Auth\ForgotPasswordController@showLinkRequestForm")
    ->where('any', '.*');


Route::prefix('/register')->group(function () {
    Route::get('', 'ErrorController@Error404');
    Route::post('','ErrorController@Error404');
});

