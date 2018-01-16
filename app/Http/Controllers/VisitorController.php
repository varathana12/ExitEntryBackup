<?php

namespace App\Http\Controllers;

use App\UsedCompany;
use App\Visitor;
use Illuminate\Http\Request;
use App\EntryExitInformation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\utilities\Transformer;

class VisitorController extends Controller
{


    public function getAuth()
    {
        if (Auth::check()) {

            $user = Auth::user();
            $user->status = true;
            error_log($user);
            return $user;
        } else {
            return array('status' => false);
        }


    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getAll()
    {
        $usedCompanyId = Auth::user()->used_company_id;
        $visitors = UsedCompany::find($usedCompanyId)
            ->visitors()
            ->paginate(PER_PAGE);
        return response()->json($visitors);
    }

    public function getLastId()
    {
        $lastRow = Visitor::withTrashed()
            ->select(MEMBER_ID)
            ->orderBy(MEMBER_ID, 'desc')
            ->first();
        $lastId = $lastRow->member_id;
        return response()->json($lastId + 1);
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

        $visitor = new Visitor;

        if ($request->route()->getName() === 'admin') {
            $visitor->used_company_id = Auth::user()->used_company_id;
            $visitor->update_manager_id = Auth::id();
        } else {
            $visitor->used_company_id = $request->header(USED_COMPANY_ID);
        }

        $visitor->company_name = $request->input(COMPANY_NAME);
        $visitor->name = $request->input(NAME);
        $visitor->email_address = $request->input(EMAIL_ADDRESS);
        $visitor->phone_number = $request->input(PHONE_NUMBER);

        //transaction will rollback all record if the operation is not success.
        return DB::transaction(function () use ($visitor) {
            $status = $visitor->save();
            return response()->json($status);
        });
    }

    public function getAllEmails(Request $request)
    {



            $companyId = $request->header(USED_COMPANY_ID);

        $visitors = Visitor::where(USED_COMPANY_ID, $companyId)
            ->select(EMAIL_ADDRESS, COMPANY_NAME, MEMBER_ID, NAME)
            ->get();

        return response()->json($visitors);
    }
    public function getAllVisitors(Request $request)
    {

        $companyId =  Auth::user()->used_company_id;

        $visitors = Visitor::where(USED_COMPANY_ID, $companyId)
            ->select(EMAIL_ADDRESS, COMPANY_NAME, MEMBER_ID, NAME)
            ->get();

        return response()->json($visitors);
    }

    /**
     * Display the specified resource.
     *
     * @param $request
     * @return \Illuminate\Http\Response
     */
    public function get(Request $request)
    {

        $usedCompanyId = $request->header(USED_COMPANY_ID);
        $email = $request->input(EMAIL_ADDRESS);

        $visitor = Visitor::where(USED_COMPANY_ID, $usedCompanyId)
            ->where(EMAIL_ADDRESS, $email)
            ->get();

        if ($visitor->count() < 1) {
            $messages = array(MESSAGE_ID => 'e0001');

            return response()->json($messages);
        } else {

            $date = Carbon::today(); // equivalent to yyyy-mm-dd 00:00:00

            $entryExit = EntryExitInformation::where(MEMBER_ID, $visitor->first()->member_id)
                ->where(ENTRY_DATETIME, '>', $date)
                ->where(USED_COMPANY_ID, $usedCompanyId)
                ->where(EXIT_DATETIME, null)
                ->get();

            if (count($entryExit) > 0) {
                //$messages = Message::where('message_id','e009')->first();
                $messages = array(MESSAGE_ID => 'e0009');
                return response()->json($messages);
            }
        }
        return response()->json($visitor->first());
    }

    public function isExistingEmail(Request $request)
    {
        $request->merge(array('email', strtolower(trim((Transformer::toHalfWidth($request->input('email')))))));
        $request->validate([
            'email' => 'required|email',
            'id' => 'required'
        ]);
        $usedCompanyId = Auth::user()->used_company_id ?? $request->header(USED_COMPANY_ID);
        $email = $request->input('email');
        $memberId = $request->input('id');

        $visitor = UsedCompany::find($usedCompanyId)
            ->visitors()
            ->withTrashed()
            ->where(EMAIL_ADDRESS, $email)
            ->where(MEMBER_ID, '!=', $memberId)
            ->get();

        return response()->json(count($visitor) > 0);
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

        $memberId = $request->input(MEMBER_ID);

        $visitor = Visitor::find($memberId);

        if ($request->route()->getName() === 'admin')
            $visitor->update_manager_id = Auth::id();
        $visitor->company_name = $request->input(COMPANY_NAME);
        $visitor->name = $request->input(NAME);
        $visitor->email_address = $request->input(EMAIL_ADDRESS);
        $visitor->phone_number = $request->input(PHONE_NUMBER);

        return DB::transaction(function () use ($visitor) {
            $status = $visitor->update();
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
        $visitor = Visitor::find($request->input('id'));

        $visitor->update_manager_id = Auth::id();

        return DB::transaction(function () use ($visitor) {
            $visitor->update();
            $status = $visitor->delete();
            return response()->json($status);
        });
    }

    protected function rules()
    {
        return [
            COMPANY_NAME => 'required|max:100',
            NAME => 'required|max:100',
            EMAIL_ADDRESS => 'required|max:100|email',
            PHONE_NUMBER => 'required|phone:AUTO,JP'
        ];
    }

    protected function transformInput(Request $request)
    {
        $request->merge(array(COMPANY_NAME, trim(Transformer::toHalfWidth($request->input(COMPANY_NAME)))));
        $request->merge(array(NAME, trim(Transformer::toHalfWidth($request->input(NAME)))));
        $request->merge(array(EMAIL_ADDRESS, strtolower(trim((Transformer::toHalfWidth($request->input(EMAIL_ADDRESS)))))));
        $request->merge(array(PHONE_NUMBER, Transformer::filterPhoneNumber(Transformer::toHalfWidth($request->input(PHONE_NUMBER)))));
        return $request;
    }
}
