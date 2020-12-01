<?php
include 'auth.php';
include 'dbconnect.php';
include 'utils.php';

$isTokenSet = isset($_SERVER['HTTP_TOKEN']);
$curr_url = 'http://' . $_SERVER['HTTP_HOST'] . '/';
$contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
$loginReq = isset($_SERVER["HTTP_LOGIN"]);

if ($isTokenSet) {
    $token = $_SERVER['HTTP_TOKEN'];
    $data =  validateJWT($token, 'chandan');
    if($data["ok"]){
    echo json_encode(["msg"=>"token ok","ok"=>1]);
    }else {
        echo json_encode(["msg"=>"token fail","ok"=>0]);
    }
} else if ($_SERVER["REQUEST_METHOD"] == "POST" && $loginReq) {

    $content = trim(file_get_contents("php://input"));

    $decoded = json_decode($content, true);

    $email = $decoded['email'];
    $password = $decoded['pass'];
    $userType = $decoded["userType"];
    $table = "";
    if ($userType == "hospital") {
        $table = $GLOBALS["tableHosp"];
    } else {
        $table = $GLOBALS["tableRec"];
    }
    $sql = "SELECT * FROM $table WHERE email='$email'";
    $result = mysqli_query($conn, $sql);
    $num = mysqli_num_rows($result);
    $user = mysqli_fetch_array($result);

    if ($num && password_verify($password, $user["hash"])) {
       unset($user["hash"]); unset($user[2]);
       $user["usertype"] = $userType;
        $jwt = genJWT('chandan', $user);
        echo json_encode(["ok" => 1, "token" => $jwt, "userType" => $userType, "msg" => "login succeseful"]);
    } else {
        echo json_encode((["ok" => 0, "msg" => "login failed"]));
    }
} else {
    echo json_encode(["msg" => "method is not post","db"=>$GLOBALS["con_db"]]);
}
