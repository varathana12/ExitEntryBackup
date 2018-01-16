<?php
/**
 * Created by PhpStorm.
 * User: rathana
 * Date: 1/11/18
 * Time: 10:41 AM
 */

namespace App\Http\Controllers;


use Illuminate\Http\Request;

use Illuminate\Session\TokenMismatchException;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Hashing\Hasher;
use Illuminate\Support\Facades\Hash;

class ResetPassword extends Controller
{
    public function showResetForm(Request $request){
        $email = $request->get(ADMINISTRATOR_EMAIL);
        $token = $request->route()->parameter(TOKEN);

        $status = $this->isExitedToken($email,$token);
        if($status){
            return view('auth.passwords.reset');
        }
        else{
            throw new TokenMismatchException();
        }

    }

    public function isExitedToken($email,$token){
        $reset = DB::table("password_resets")->where(ADMINISTRATOR_EMAIL, $email)->first();
        if($reset!=null){
            return Hash::check($token, $reset->token);
        }
        return false;
    }

}