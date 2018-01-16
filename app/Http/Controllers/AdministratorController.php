<?php

namespace App\Http\Controllers;

use App\Administrator;
use App\UsedCompany;
use App\utilities\Transformer;
use DeepCopy\f001\A;
use Illuminate\Http\Request;
use App\EntryExitInformation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdministratorController extends Controller
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
        $companyId = Auth::user()->used_company_id;
        $admins = UsedCompany::find($companyId)
            ->admins()
            ->paginate(PER_PAGE);
        return response()->json($admins);
    }

    public function isResetEmails(Request $request)
    {
        error_log($request->get(ADMINISTRATOR_EMAIL));
        $admin = Administrator::where(DELETED_AT,null)
            ->where(ADMINISTRATOR_EMAIL,$request->get(ADMINISTRATOR_EMAIL))
            ->select(ADMINISTRATOR_EMAIL)->get();
        if(count($admin)>0){
            return response()->json(array('status'=>true));
        }
        return response()->json(array('status'=>false));
    }

    /**
     * Check email existence in administrators table
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function isExistingEmail(Request $request)
    {
        $request->merge(array('email', strtolower(trim((Transformer::toHalfWidth($request->input('email')))))));
        $request->validate([
            'email' => 'required|email',
            'id' => 'required'
        ]);
        $usedCompanyId = Auth::user()->used_company_id;
        $email = $request->input('email');
        $id = $request->input('id');

        $admins = UsedCompany::find($usedCompanyId)
            ->admins()
            ->withTrashed()
            ->where(ADMINISTRATOR_EMAIL, $email)
            ->where(ADMINISTRATOR_ID, '!=', $id)
            ->get();
        return response()->json(count($admins) > 0);
    }

    public function getEmail()
    {
        $user = $this->getAuth();
        if ($user->status) {
            $admin = Administrator::where(USED_COMPANY_ID, $user->used_company_id)
                ->get();
            return response()->json($admin);

        } else {
            return response()->json(array('status' => false));
        }
    }

    public function getLastId()
    {
        $user = $this->getAuth();
        if ($user->status) {
            $lastRow = Administrator::withTrashed()
                ->select(ADMINISTRATOR_ID)
                ->orderby(ADMINISTRATOR_ID, 'desc')
                ->first();
            return response()->json($lastRow->administrator_id + 1);
        } else {
            return response()->json(false);
        }
    }

    public function getCompany()
    {
        $user = $this->getAuth();
        if ($user->status) {
            $companyId = $user->used_company_id;
            $company = UsedCompany::where(USED_COMPANY_ID, $companyId)->first();
            return response()->json(array('status' => true, 'company' => $company));
        } else {
            return response()->json(array('status' => false));
        }
    }

    public function store(Request $request)
    {
        $user = $this->getAuth();
        if ($user->status) {
            $admin = new Administrator;

            $admin->email = $request->get(ADMINISTRATOR_EMAIL);
            $admin->password = Hash::make($request->get(PASSWORD));
            $admin->used_company_id = $user->used_company_id;

            return DB::transaction(function () use ($admin) {
                $status = $admin->save();
                return response()->json(array('status' => $status));
            });
        } else {
            return response()->json(array('status' => false));
        }
    }

    public function update(Request $request)
    {
        $user = $this->getAuth();
        if ($user->status) {
            $admin = Administrator::where(ADMINISTRATOR_ID, $request->input(ADMINISTRATOR_ID))->first();

            $admin->email = $request->input(ADMINISTRATOR_EMAIL);

            $requestPassword = $request->input(PASSWORD);
            error_log($requestPassword);
            if ($requestPassword != $admin->password)
                $admin->password = Hash::make($requestPassword);

            return DB::transaction(function () use ($admin) {
                $status = $admin->update();
                return response()->json(array('status' => $status));
            });
        } else {
            return response()->json(array('status' => false));
        }
    }

    public function updateToken(Request $request)
    {
        $user = $this->getAuth();
        if ($user->status) {

            return DB::transaction(function () use ($user, $request) {
                $usedCompany = UsedCompany::where(USED_COMPANY_ID, $user->used_company_id)
                    ->first();
                $usedCompany->token = str_random(30);
                $status = $usedCompany->update();

                return response()->json(array('status' => $status, 'token' => $usedCompany->token));
            });
        } else {
            return response()->json(array('status' => false));
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $administrator = Administrator::find($request->input('id'));

        return DB::transaction(function () use ($administrator) {
            $status = $administrator->delete();
            return response()->json($status);
        });
    }
}
