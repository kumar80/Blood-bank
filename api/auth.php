<?php

function genJWT($secret, $user)
{
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode($user); 
    $base64UrlHeader = str_replace(['+', '/', '='], ['+', '/', '='], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['+', '/', '='], base64_encode($payload));
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['+', '/', '='], base64_encode($signature));
    $jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    return $jwt;
}

function validateJWT($token, $secret)
{
    $data = explode('.', $token);
    $base64UrlHeader = $data[0];
    $base64UrlPayload = $data[1];
    $base64UrlSignature = $data[2];
    $_signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
    $_base64UrlSignature = str_replace(['+', '/', '='], ['+', '/', '='], base64_encode($_signature));
    $data=[];
    if ($_base64UrlSignature == $base64UrlSignature) {
        $payload =  str_replace(['+', '/', '='], ['+', '/', '='], base64_decode($base64UrlPayload));
        $data = json_decode($payload,true);
        $data['ok'] = true;
    } else {
        $data = ['ok' => false];
    }
    return $data;
}

function decodeToken($token){
    $dd = explode('.', $token);
    $base64UrlPayload = $dd[1];
    $payload_json_encode = str_replace(['+', '/', '='],['+', '/', '='],  base64_decode($base64UrlPayload));
    $payload = json_decode($payload_json_encode);
    return $payload;
}