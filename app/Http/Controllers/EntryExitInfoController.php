<?php

namespace App\Http\Controllers;

use App\UsedCompany;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\EntryExitInformation;

class EntryExitInfoController extends Controller
{

    public function getAuth(){
        if(Auth::check()) {

            $user = Auth::user();
            $user->status = true;
//            error_log($user);
            return $user;
        }
        else{
            return array('status'=>false);
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getAll()
    {
        $companyId = Auth::user()->used_company_id;
        $entryExitInfo = UsedCompany::find($companyId)
            ->entryExitInfos()
            ->paginate(PER_PAGE);
        return response()->json($entryExitInfo);
    }

    /**
     * Fetch all the visitors currently in the hall
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInHallVisitors(Request $request)
    {
        $usedCompanyId = $request->header(USED_COMPANY_ID);
        $today = Carbon::today();   // === yyyy-mm-dd 00:00:00

        $visitors = EntryExitInformation::with('visitor')
            ->where(USED_COMPANY_ID, $usedCompanyId)
            ->where(ENTRY_DATETIME, '>', $today)
            ->where(EXIT_DATETIME, null)
            ->where(EXIT_CONFIRMER_ID, null)
            ->orderBy(ENTRY_DATETIME)
            ->get();
        return response()->json($visitors);
    }
    //for admin page
    public function getInHallAdmin(Request $request)
    {
        $usedCompanyId = Auth::user()->used_company_id;
        $today = Carbon::today();   // === yyyy-mm-dd 00:00:00

        $visitors = EntryExitInformation::with('visitor')
            ->where(USED_COMPANY_ID, $usedCompanyId)
            ->where(ENTRY_DATETIME, '>', $today)
            ->where(EXIT_DATETIME, null)
            ->where(EXIT_CONFIRMER_ID, null)
            ->orderBy(ENTRY_DATETIME)
            ->get();
        return response()->json($visitors);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $entryExit = new EntryExitInformation;

        if ($request->route()->getName() === 'admin') {
            $entryExit->used_company_id = Auth::user()->used_company_id;
            $entryExit->update_manager_id = Auth::id();
        } else {
            $entryExit->used_company_id = $request->header(USED_COMPANY_ID);
        }

        $entryExit->member_id = $request->input(MEMBER_ID);
        $entryExit->number_of_visitor = $request->input(NUMBER_OF_VISITOR);
        $entryExit->entry_datetime = Carbon::now();

        return DB::transaction(function () use ($entryExit) {
            $status = $entryExit->save();
            return response()->json($status);
        });
    }
    public function entryVisitor(Request $request){

        $user = $this->getAuth();
        if($user->status){
            $memberId = $request->get(MEMBER_ID);
            $companyId = $user->used_company_id;
            $numberOfVisitor = $request->get(NUMBER_OF_VISITOR);
            $entry_datetime = $request->get(ENTRY_DATETIME);
            $exit_datetime = $request->get(EXIT_DATETIME);
            $exit_confirmer = $request->get(EXIT_CONFIRMER_ID);
            $administrator_id = $user->administrator_id;
            return DB::transaction(function () use ($administrator_id,$memberId, $companyId
                , $numberOfVisitor,$entry_datetime,$exit_datetime,$exit_confirmer) {
                $entryExit = new EntryExitInformation;

                $entryExit->member_id = $memberId;
                $entryExit->used_company_id = $companyId;
                $entryExit->number_of_visitor = $numberOfVisitor;
                $entryExit->entry_datetime = $entry_datetime;
                if($exit_datetime!='null'){
                    $entryExit->exit_datetime = $exit_datetime;
                }
                if($exit_confirmer!=''){
                    $entryExit->exit_confirmer_id = $exit_confirmer;
                }
                $entryExit->update_manager_id = $administrator_id;
                $status = $entryExit->save();

                return response()->json(array("status"=>$status));
            });
        }
        else{
            return response()->json(array("status"=>false));
        }

    }
    public function updateEntryVisitor(Request $request){

        $user = $this->getAuth();
        if($user->status){
            $entry_exit_information_id = $request->get(ENTRY_EXIT_INFORMATION_ID);

            $numberOfVisitor = $request->get(NUMBER_OF_VISITOR);
            $entry_datetime = $request->get(ENTRY_DATETIME);
            $exit_datetime = $request->get(EXIT_DATETIME);
            $exit_confirmer = $request->get(EXIT_CONFIRMER_ID);
            $administrator_id = $user->administrator_id;

            return DB::transaction(function () use ($administrator_id,$entry_exit_information_id
                , $numberOfVisitor,$entry_datetime,$exit_datetime,$exit_confirmer) {
                $entryExit = EntryExitInformation::where(ENTRY_EXIT_INFORMATION_ID,$entry_exit_information_id)->first();
                $entryExit->number_of_visitor = $numberOfVisitor;
                $entryExit->entry_datetime = $entry_datetime;
                if($exit_datetime!='null'){
                    $entryExit->exit_datetime = $exit_datetime;
                }

                $entryExit->update_manager_id = $administrator_id;
                if($exit_confirmer!=''){
                    $entryExit->exit_confirmer_id = $exit_confirmer;

                }
                else{
                    $entryExit->exit_confirmer_id = null;

                }
                $status = $entryExit->update();
                error_log($entryExit);
                return response()->json(array("status"=>$status));
            });
        }
        else{
            return response()->json(array("status"=>false));
        }

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {


    }


    /**
     * Remove the specified resource from storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $entryExitInfo = EntryExitInformation::find($request->input('id'));

        $entryExitInfo->update_manager_id = Auth::id();

        return DB::transaction(function () use ($entryExitInfo) {
            $entryExitInfo->update();
            $status = $entryExitInfo->delete();
            return response()->json($status);
        });
    }
}
