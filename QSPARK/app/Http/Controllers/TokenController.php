<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TokenController extends Controller
{
    public function storeToken(Request $request)
    {
        $token = $request->query('token');

        if (!$token) {
            return response('Token missing', 400);
        }

        session(['qspark_token' => $token]);

        return redirect()->route('student-dashboard');
    }
}
