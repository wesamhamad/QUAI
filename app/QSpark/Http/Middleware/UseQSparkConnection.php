<?php

namespace App\QSpark\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

/**
 * Makes `qspark` the default database connection for the duration of a QSPARK
 * request.
 *
 * The merged QSPARK controllers/models contain ~80 raw DB::table() / DB::select()
 * calls with no explicit connection — in the standalone app the default
 * connection *was* the QSPARK database, so they "just worked". Rewriting every
 * call is error-prone; instead we swap the default connection here and restore
 * it on the way out.
 *
 * Restoring before the response bubbles back through StartSession matters: the
 * session (SESSION_DRIVER=database) is read/written on QUAI's default
 * connection, and StartSession persists it as the response unwinds. This
 * middleware sits *inside* StartSession, so `finally` restores the connection
 * before the session is saved. The database cache store is pinned separately
 * via DB_CACHE_CONNECTION so Cache:: keeps hitting QUAI's connection.
 */
class UseQSparkConnection
{
    public function handle(Request $request, Closure $next): Response
    {
        $previous = DB::getDefaultConnection();
        DB::setDefaultConnection('qspark');

        try {
            return $next($request);
        } finally {
            DB::setDefaultConnection($previous);
        }
    }
}
