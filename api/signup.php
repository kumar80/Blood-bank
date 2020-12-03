<?php
include 'utils.php';
include 'auth.php';
include 'dbconnect.php';
$reqType = isset($_SERVER["HTTP_REQTYPE"]) ? trim($_SERVER["HTTP_REQTYPE"]) : '';;

function signup_hosp($decoded, $table)
{
    include 'dbconnect.php';
    $user = array();
    $user["name"] = $decoded["name"];
    $user["email"] = $decoded["email"];
    $password = $decoded["password"];
    $user["phone"] = $decoded["phone"];
    $user["address"] = $decoded["address"];
    $user["userType"] = "hospital";
    $user["id"] = uniqid();

    $sql = "SELECT * FROM `$table` WHERE email='" . $user["email"] . "'";
    $result = mysqli_query($conn, $sql);
    $num = mysqli_num_rows($result);

    if ($num == 0) {
        $hash = password_hash(
            $password,
            PASSWORD_DEFAULT,
            ['cost' => 15]
        );

        $sql = "INSERT INTO  `$table`  (`id`,`email`,`phone`,`address`,`hash`,`name`)
                              VALUES ('" . $user["id"] . "','" . $user["email"] . "','" . $user["phone"] . "',
                                            '" . $user["address"] . "','$hash','" . $user["name"] . "')";

        $result = mysqli_query($conn, $sql);

        if ($result) {

            $token = genJWT('chandan', $user);
            echo json_encode([
                "ok" => 1, "msg" => "Signed up successfully",
                "token" => $token, "userType" => $user["userType"]
            ]);
        } else {
            echo json_encode(["ok" => 0, "msg" => "Signup fail:(", "fas" => $result]);
        }
    } else {
        echo json_encode(["ok" => 0, "msg" => "user with same email already registered"]);
    }
}
function signup_rec($decoded, $table)
{
    include 'dbconnect.php';
    $user = array();
    $user["name"]  = $decoded["name"];
    $user["email"] = $decoded["email"];
    $password = $decoded["password"];
    $user["phone"] = $decoded["phone"];
    $user["blood_type"] = $decoded["blood"];
    $user["userType"] = "receiver";
    $user["id"] = uniqid();
    $sql = "SELECT * FROM `$table` WHERE  email='" . $user["email"] . "'";
    $result = mysqli_query($conn, $sql);
    $num = mysqli_num_rows($result);
    if ($num == 0) {
        $hash = password_hash(
            $password,
            PASSWORD_DEFAULT,
            ['cost' => 15]
        );
        $sql = "INSERT INTO `$table` (`name`,`email`,`hash`,`phone`,`blood_type`,`id`)
                                VALUES ('" . $user["name"] . "','" . $user["email"] . "','$hash',
                                        '" . $user["phone"] . "','" . $user["blood_type"] . "','" . $user["id"] . "')";
        $result = mysqli_query($conn, $sql);
        if ($result) {
            $token = genJWT('chandan', $user);
            echo json_encode(["ok" => 1, "msg" => "Signed up successfully", "token" => $token, "userType" => $user["userType"]]);
        } else {
            echo json_encode(["ok" => 0, "msg" => "Signup fail:(", "wad" => $user]);
        }
    } else {
        echo json_encode(["ok" => 0, "msg" => "user with same email already registered"]);
    }
}
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $content = trim(file_get_contents("php://input"));

    $decoded = json_decode($content, true);

    if (isset($decoded["hosp"])) {
        signup_hosp($decoded, $GLOBALS["tableHosp"]);
    } else {
        signup_rec($decoded, $GLOBALS["tableRec"]);
    }
} else {
    echo json_encode(array("msg" => "method is not post", "sad" => $_SERVER));
}
