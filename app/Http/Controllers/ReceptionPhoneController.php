<?php

namespace App\Http\Controllers;

use App\utilities\Transformer;
use Illuminate\Http\Request;
use App\ReceptionPhone;
use App\UsedCompany;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReceptionPhoneController extends Controller
{
    private $receptionPhoneId;
    private $receptionPhoneNumber;
    private $usedCompanyId;
    private $updateManagerId;

    /**
     * Get reception phone number for Admission module
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function get(Request $request)
    {
        $this->usedCompanyId = $request->header(USED_COMPANY_ID);
        $this->receptionPhoneNumber = UsedCompany::find($this->usedCompanyId)
            ->receptionPhone()
            ->first()
            ->reception_phone_number;
        return response()->json($this->receptionPhoneNumber);
    }

    /**
     * Get all records belong to particular used company
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAll()
    {
        $this->usedCompanyId = Auth::user()->used_company_id;
        $tels = UsedCompany::find($this->usedCompanyId)
            ->receptionPhone()
            ->paginate(PER_PAGE);
        return response()->json($tels);
    }

    /**
     * Get latest id from reception_phone_number table
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLastId()
    {
        $lastRow = ReceptionPhone::withTrashed()
            ->select(RECEPTION_PHONE_ID)
            ->orderBy(RECEPTION_PHONE_ID, 'desc')
            ->first();
        $lastId = $lastRow->reception_phone_id;
//        error_log($lastId);
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

        $this->usedCompanyId = Auth::user()->used_company_id;
        $this->updateManagerId = Auth::id();
        $this->receptionPhoneNumber = $request->input(RECEPTION_PHONE_NUMBER);

        $receptionPhone = new ReceptionPhone;

        $receptionPhone->used_company_id = $this->usedCompanyId;
        $receptionPhone->update_manager_id = $this->updateManagerId;
        $receptionPhone->reception_phone_number = $this->receptionPhoneNumber;

        return DB::transaction(function () use ($receptionPhone) {
            $status = $receptionPhone->save();
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

        $this->receptionPhoneId = $request->input(RECEPTION_PHONE_ID);
        $this->receptionPhoneNumber = $request->input(RECEPTION_PHONE_NUMBER);
        $this->updateManagerId = Auth::id();

        $receptionPhone = ReceptionPhone::find($this->receptionPhoneId);
        $receptionPhone->reception_phone_number = $this->receptionPhoneNumber;
        $receptionPhone->update_manager_id = $this->updateManagerId;

        return DB::transaction(function () use ($receptionPhone) {
            $status = $receptionPhone->update();
            return response()->json($status);
        });
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $this->receptionPhoneId = $request->input('id');

        $receptionPhone = ReceptionPhone::find($this->receptionPhoneId);
        $receptionPhone->update_manager_id = Auth::id();

        return DB::transaction(function () use ($receptionPhone) {
            $receptionPhone->update();
            $status = $receptionPhone->delete();
            return response()->json($status);
        });
    }

    /**
     * Transform request inputs
     * @param $request
     * @return mixed
     */
    protected function transformInput($request)
    {
        $this->receptionPhoneNumber = $request->input(RECEPTION_PHONE_NUMBER);
        $this->receptionPhoneNumber = Transformer::toHalfWidth($this->receptionPhoneNumber);
        $this->receptionPhoneNumber = Transformer::filterPhoneNumber($this->receptionPhoneNumber);
        $request->merge(array(RECEPTION_PHONE_NUMBER, $this->receptionPhoneNumber));
        return $request;
    }

    /**
     * Validation rules
     * @return array
     */
    protected function rules()
    {
        return [
            RECEPTION_PHONE_NUMBER => 'required|phone:AUTO,JP'
        ];
    }
}
