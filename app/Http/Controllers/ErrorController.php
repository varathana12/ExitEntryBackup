<?php


namespace App\Http\Controllers;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Auth\AuthenticationException;
class ErrorController extends Controller
{
    public function Error404(){
        throw new NotFoundHttpException();
    }

    public function Error401(){
        throw new AuthenticationException();
    }

}