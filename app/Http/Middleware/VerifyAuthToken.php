<?php

namespace App\Http\Middleware;

use App\UsedCompany;
use Closure;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\InteractsWithTime;
use Illuminate\Support\Facades\Log;
/**
 * Class VerifyAuthToken
 * @package App\Http\Middleware
 */
class VerifyAuthToken
{
    use InteractsWithTime;

    /**
     * The application instance.
     *
     * @var \Illuminate\Foundation\Application
     */
    protected $app;

    /**
     * The URIs that should be excluded from token verification.
     *
     * @var array
     */
    protected $except = [
        //
    ];

    /**
     * Create a new middleware instance.
     *
     * @param  \Illuminate\Foundation\Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     *
     */
    public function handle(Request $request, Closure $next)
    {
        // check if the app is in unit testing mode or url is in except array
        if (!($this->runningUnitTests() || $this->inExceptArray($request))) {
            // get used_company_id from request
            $usedCompanyId = $this->getUsedCompanyId($request);
            Log::info($usedCompanyId);
            // get Token from request
            $requestToken = $this->getRequestToken($request);
            // get Token from correspond Used Company from Database
            $DBToken = UsedCompany::findOrFail($usedCompanyId)->token;
            // comparing request's token and DB's token
            if (!(is_string($DBToken) &&
                is_string($requestToken) &&
                hash_equals($DBToken, $requestToken))) {
                return response('Unauthorized', '401');
            }
        }

        return $next($request);
    }

    /**
     * @param $request
     * @return mixed
     */
    protected function getRequestToken($request)
    {
        return $request->input(TOKEN) ?? $request->header(TOKEN);
    }

    /**
     * @param $request
     * @return mixed
     */
    protected function getUsedCompanyId($request)
    {
        Log::info($request);
        return $request->route()->parameter('usedCompanyId') ?? $request->header(USED_COMPANY_ID);
    }

    /**
     * Determine if the application is running unit tests.
     *
     * @return bool
     */
    protected function runningUnitTests()
    {
        return $this->app->runningInConsole() && $this->app->runningUnitTests();
    }

    /**
     * Determine if the request has a URI that should pass through Exit Token verification.
     *
     * @param  \Illuminate\Http\Request $request
     * @return bool
     */
    protected function inExceptArray($request)
    {
        foreach ($this->except as $except) {
            if ($except !== '/') {
                $except = trim($except, '/');
            }

            if ($request->is($except)) {
                return true;
            }
        }
        return false;
    }

}
