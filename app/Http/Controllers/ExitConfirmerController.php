<?php

namespace App\Http\Controllers;

use App\UsedCompany;
use App\utilities\Transformer;
use Illuminate\Http\Request;
use App\ExitConfirmer;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\EntryExitInformation;
class ExitConfirmerController extends Controller
{
    protected $usedCompanyId;
    protected $updateManagerId;
    protected $exitConfirmerId;
    protected $idName;
    protected $existence;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function getAuth(){
        if(Auth::check()) {

            $user = Auth::user();
            $user->status = true;
            error_log($user);
            return $user;
        }
        else{
            return array('status'=>false);
        }


    }

    public function getAll()
    {
        $this->usedCompanyId = Auth::user()->used_company_id;
        $exitConfirmers = UsedCompany::find($this->usedCompanyId)

            ->exitConfirmers()
            ->paginate(PER_PAGE);
        return response()->json($exitConfirmers);
    }

    public function getConfirmer(Request $request)
    {
        $company_id = $request->header(USED_COMPANY_ID);
        error_log($company_id);
        $confirmer = UsedCompany::find($company_id)
            ->exitConfirmers()
            ->where(DELETED_AT, null)
            ->select(EXIT_CONFIRMER_ID, ID_NAME)
            ->get();

        return response()->json($confirmer);
    }

    /**
     * Get latest id from exit_confirmers table
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLastId()
    {
        $lastRow = ExitConfirmer::withTrashed()
            ->select(EXIT_CONFIRMER_ID)
            ->orderBy(EXIT_CONFIRMER_ID, 'desc')
            ->first();
        $lastId = $lastRow->exit_confirmer_id;
        return response()->json($lastId + 1);
    }

    public function confirmed(Request $request)
    {
        error_log("get");
        return DB::transaction(function () use ($request) {
            $exit_confirmer_id = $request->get(EXIT_CONFIRMER_ID);
            $time = $request->get('time');
            $date_time = Carbon::now()->format('Y-m-d') . ' ' . $time;
            $member_id = $request->get(MEMBER_ID);
            $date = Carbon::now()->format('y-m-d') . ' 00:00:00';
            $entry = EntryExitInformation::where(MEMBER_ID, $member_id)
                ->where(EXIT_DATETIME, null)
                ->where(ENTRY_DATETIME, '>', $date)
                ->first();
            error_log($entry);
            $entry->exit_confirmer_id = $exit_confirmer_id;
            $entry->exit_datetime = $date_time;
            $status = $entry->update();
            error_log($date_time);
            return response()->json($status);
        });
    }

    public function registerConfirmer(Request $request)
    {

        error_log("get request");
        return DB::transaction(function () use ($request) {
            $company_id = $request->header(USED_COMPANY_ID);
            $name = $request->get(ID_NAME);
            $time = $request->get('time');
            $date = Carbon::now()->format('y-m-d') . ' 00:00:00';
            $date_time = Carbon::now()->format('Y-m-d') . ' ' . $time;

            $member_id = $request->get(MEMBER_ID);
            error_log($member_id);
            $exit_confirmer = new ExitConfirmer;
            error_log($exit_confirmer);
            $exit_confirmer->id_name = $name;

            $exit_confirmer->used_company_id = $company_id;


            $status_register = $exit_confirmer->save();

            $exit_confirmer_id = $exit_confirmer->exit_confirmer_id;

            $entry = EntryExitInformation::where(MEMBER_ID, $member_id)
                ->where(EXIT_DATETIME, null)
                ->where(ENTRY_DATETIME, '>', $date)
                ->first();
            error_log($entry);
            $entry->exit_confirmer_id = $exit_confirmer_id;
            $entry->exit_datetime = $date_time;
            $status = $entry->update();
            return response()->json($status);
        });

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request = $this->transformInput($request);
        $request->validate($this->rules());

        $this->exitConfirmerId = null;
        $this->idName = $request->input(ID_NAME);

        $this->existence = $this->checkExistence($this->exitConfirmerId, $this->idName);
        if ($this->existence)
            return response('duplicated');

        $exitConfirmer = new ExitConfirmer;

        $exitConfirmer->id_name = $this->idName;
        if ($request->route()->getName() === 'admin') {
            $exitConfirmer->update_manager_id = Auth::id();
            $exitConfirmer->used_company_id = Auth::user()->used_company_id;
        } else {
            $exitConfirmer->used_company_id = $request->header(USED_COMPANY_ID);
        }

        return DB::transaction(function () use ($exitConfirmer) {
            $status = $exitConfirmer->save();
            return response()->json($status);
        });
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $request = $this->transformInput($request);
        $request->validate($this->rules());

        $this->exitConfirmerId = $request->input(EXIT_CONFIRMER_ID);
        $this->idName = $request->input(ID_NAME);
        $this->updateManagerId = Auth::id();

        $this->existence = $this->checkExistence($this->exitConfirmerId, $this->idName);
        if ($this->existence)
            return response('duplicated');

        $exitConfirmer = ExitConfirmer::find($this->exitConfirmerId);
        $exitConfirmer->id_name = $this->idName;
        $exitConfirmer->update_manager_id = $this->updateManagerId;

        return DB::transaction(function () use ($exitConfirmer) {
            $status = $exitConfirmer->update();
            return response()->json($status);
        });
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $exitConfirmer = ExitConfirmer::find($request->input('id'));

        $exitConfirmer->update_manager_id = Auth::id();

        return DB::transaction(function () use ($exitConfirmer) {
            $exitConfirmer->update();
            $status = $exitConfirmer->delete();
            return response()->json($status);
        });
    }

    /**
     * Check whether or not an ID Name already exists
     * @param $exitConfirmerId
     * @param $idName
     * @return bool
     */
    protected function checkExistence($exitConfirmerId, $idName)
    {
        $existingIdName = ExitConfirmer::where(EXIT_CONFIRMER_ID, '!=', $exitConfirmerId)
            ->where(ID_NAME, strtolower($idName))
            ->get();
        return (count($existingIdName) > 0);
    }

    /**
     * Transform request inputs
     * @param $request
     * @return mixed
     */
    protected function transformInput($request)
    {
        $request->merge(array(ID_NAME, trim((Transformer::toHalfWidth($request->input(ID_NAME))))));
        return $request;
    }

    /**
     * Validation rules
     * @return array
     */
    protected function rules()
    {
        return [
            ID_NAME => 'required|max:100'
        ];
    }
}
