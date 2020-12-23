<?php

namespace App\Http\Middleware;
use http\Cookie;
use Illuminate\Support\Facades\DB;
use Closure;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
            if(\Illuminate\Support\Facades\Auth::user()['role_ID']==0)
                return $next($request);
            return response()->json(['msg'=>"illegal hack"]);

    }
}
