<?php
include 'auth.php';
include 'dbconnect.php';
include 'utils.php';

$reqType = isset($_SERVER["HTTP_REQ_TYPE"]) ? trim($_SERVER["HTTP_REQ_TYPE"]) : '';;
$reqMethod = $_SERVER["REQUEST_METHOD"];
if ($reqType == "fetch_Blood_Data" &&  $reqMethod == "POST") {
    $table = $GLOBALS["tableBloodInfo"];
    $content = trim(file_get_contents("php://input"));
    $data = json_decode($content, true);
    $sql = "SELECT * FROM `$table`";
    if (isset($data["token"])) {
        $user = decodeToken($data["token"]);
        if (isset($user->blood_type)) {
            $bloodType = $user->blood_type;
            $sql = "SELECT * FROM `$table` WHERE blood_type = '$bloodType'";
        }
        // echo json_encode($user);

    }
    $result = mysqli_query($conn, $sql);
    $res = array();

    while ($data = mysqli_fetch_array($result)) {
        array_push($res, $data);
    }

    echo json_encode($res);
} else if ($reqMethod == "POST" && $reqType == "reqHosp") {

    $content = trim(file_get_contents("php://input"));
    $data = json_decode($content, true);

    $token = $data["token"];
    $hospitalId = $data["hospitalId"];
    $unitsReq = $data["unitsReq"];
    $receiver = decodeToken($token);
    $receiver->phone = (int)($receiver->phone);
    $uid = uniqid();
    $table = $GLOBALS["tableRequests"];

    $sql = "SELECT * FROM `$table` WHERE receiver_name='$receiver->name' && hospital_id='$hospitalId'";
    $check = mysqli_query($conn, $sql);
    $num = mysqli_num_rows($check);

    if ($num==0) {
        $sql = "INSERT INTO `$table` (`receiver_name`,`units`,`id`,`hospital_id`,`phone`,`receiver_blood_type`)
                            VALUES ('$receiver->name','$unitsReq','$uid','$hospitalId','$receiver->phone','$receiver->blood_type')";
        $result = mysqli_query($conn, $sql);
        if ($result) {
            echo json_encode((["msg" => "request done","ok"=>1]));
        }
        else {
            echo json_encode(["msg" => "error requesting", "ok" => 0]);
        }
    } else {
        echo json_encode(["msg" => "Already requested to same hospital", "ok" => 0,"rec"=>$sql]);
    }
} else if ($reqMethod == "POST" && $reqType == "getReceiverReq") {

    $content = trim(file_get_contents("php://input"));
    $data = json_decode($content, true);
    $token = $data["token"];
    $hospital = decodeToken($token);
    $table = $GLOBALS["tableRequests"];
    $sql = "SELECT * FROM `$table` WHERE hospital_id='$hospital->id'";
    $result = mysqli_query($conn, $sql);
    $res = array();

    while ($data = mysqli_fetch_array($result)) {
        array_push($res, $data);
    }
    echo json_encode($res);
} else if ($reqMethod == "POST" && $reqType == "submitBloodInfo") {
    $content = trim(file_get_contents("php://input"));

    $data = json_decode($content, true);
    $token = $data["token"];
    $type = $data["type"];
    $units = $data["units"];
    $date = $data["date"];
    $uid = uniqid();
    $hospital = decodeToken($token);
    $table = $GLOBALS["tableBloodInfo"];
    $sql = "INSERT INTO `$table` (`blood_type`,`units`,`id`,`hospital_id`,`collection_date`,`hospital_name`,`hospital_phone`)
                          VALUES ('$type','$units','$uid','$hospital->id','$date','$hospital->name','$hospital->phone')";
    $result = mysqli_query($conn, $sql);
    if ($result) {
        echo json_encode(["msg" => "blood data updated", "sada" => $GLOBALS["tableBloodInfo"]]);
    } else {
        echo json_encode(["msg" => "FAIL blood data updated", "sada" => $sql]);
    }
} else {
    echo json_encode(array("msg" => "method is not post"));
}
