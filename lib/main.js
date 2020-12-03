const web = "https://chandan80567.herokuapp.com/";
const local = "http://localhost/api/";
const HOST = local;

async function validateJWT(token) {
  const res = await fetch(HOST + "login.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });
  let data;
  try {
    data = await res.json();
  } catch (err) {
    alert("ERROR!!!! " + err.message);
    return;
  }
  return data;
}

async function loginCheck() {
  const token = localStorage.token;
  const userType = localStorage.userType;
  const path = window.location.pathname;

  if (path == "/util_rec.html") {
    if (token !== undefined) {
      return;
    }
    return;
  } else {
    if (token === undefined) {
      if (
        path !== "/login.html" &&
        path !== "/signup_hosp.html" &&
        path !== "/signup_rec.html"
      ) {
        console.log("login fail , no token ", path);

        window.location.replace("login.html");
      }
      return "";
    }
    if (
      token === undefined &&
      (path == "/login.html" ||
        path == "/util_hosp.html" ||
        path == "/util_rec.html")
    ) {
      return "";
    }

    const data = await validateJWT(token);
    console.log(data);
    if (data.ok) {
      console.log("data.ok");
      if (path == "/util_hosp.html" && userType == "hospital") {
        return;
      }
      if (
        path == "/login.html" ||
        path == "/signup_hosp.html" ||
        path == "/signup_rec.html"
      ) {
        return userType;
      }

      if (userType === "hospital") {
        window.location.replace("util_hosp.html");
        return;
      }
      if (userType === "receiver") {
        if (path == "/util_hosp.html") {
          alert("only hospitals can access this page");
          window.location.replace("util_rec.html");
        }
        return;
      }
    } else {
      window.location.replace("login.html");
      return;
    }
  }
}

async function alreadyLoggedIn() {
  const loggedInUser = await loginCheck();

  if (loggedInUser === "hospital") {
    alert("you are already logged in");
    window.location.replace("util_hosp.html");
    return true;
  }
  if (loggedInUser === "receiver") {
    alert("you are already logged in");
    window.location.replace("util_rec.html");
    return true;
  }
  console.log(loggedInUser);
  return false;
}

async function login(form) {
  const email = form.elements[0].value.trim();
  const pass = form.elements[1].value.trim();
  const userType = form.elements[2].checked
    ? form.elements[2].value
    : form.elements[3].value;

  const res = await fetch(HOST + "login.php", {
    method: "POST",
    headers: {
      login: true,
    },
    body: JSON.stringify({
      email: email,
      pass: pass,
      userType: userType,
    }),
  });
  let data;
  try {
    data = await res.json();
  } catch (err) {
    alert("ERROR!!!! " + err.message);
    return;
  }
  console.log(data);
  if (data.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userType", data.userType);
    // alert("Login success!");
    if (userType === "hospital") {
      window.location.replace("util_hosp.html");
    }
    if (userType === "receiver") {
      window.location.replace("util_rec.html");
    }
  } else {
    const el = document.getElementById("error");
    el.style.display = "";
    //    console.log(el)
    //  alert("Login Failed! Check email or password");
  }
}
const bloodTypes = ["A+", "O+", "B+", "A-", "O-", "AB+", "B-", "AB-"];

async function signupHosp(form) {
  const user = {
    hosp: true,
    name: form.elements[0].value.trim(),
    email: form.elements[1].value.trim(),
    address: form.elements[2].value.trim(),
    phone: form.elements[3].value.trim(),
    password: form.elements[4].value.trim(),
  };
  const ok = await validateForm(user);
  if (!ok) {
    return;
  }
  const res = await fetch(HOST + "signup.php", {
    method: "POST",
    headers: {
      reqType: "signup",
    },
    body: JSON.stringify(user),
  });
  let data;
  try {
    data = await res.json();
  } catch (err) {
    alert("ERROR!!!! " + err.message);
    return;
  }
  console.log(data);
  if (data.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userType", data.userType);
    // alert("signup success!");
    window.location.replace("util_hosp.html");
  } else {
    const el = document.getElementById("error");
    el.style.display = "";
    el.innerHTML = data.msg;
    // alert(
    //   "signup Failed! Check email or password \n Error messgae: " + data.msg
    // );
  }
}

async function signupRec(form) {
  const user = {
    name: form.elements[0].value.trim(),
    email: form.elements[1].value.trim(),
    phone: form.elements[2].value.trim(),
    blood: form.elements[3].value.trim(),
    password: form.elements[4].value.trim(),
  };

  const ok = await validateForm(user);
  if (!ok) {
    return;
  }
  if (!bloodTypes.includes(user.blood)) {
    const el = document.getElementById("bloodType");
    el.classList.add("is-invalid");
    return false;
  }
  const res = await fetch(HOST + "signup.php", {
    method: "POST",
    headers: {
      signup: true,
    },
    body: JSON.stringify(user),
  });
  let data;
  try {
    data = await res.json();
  } catch (err) {
    alert("ERROR!!!! " + err.message);
    return;
  }
  console.log(data);
  if (data.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userType", data.userType);
    window.location.replace("util_rec.html");
  } else {
    const el = document.getElementById("error");
    el.style.display = "";
    el.innerHTML = data.msg;
  }
}

async function reqHosp(e) {
  const userType = localStorage.userType;
  const token = localStorage.token;

  if (userType === "hospital") {
    alert("only Receiver can request!");
    return;
  }
  if (token === undefined) {
    alert("Log in as Receiver ");
    return;
  }
  const auth = await validateJWT(token);
  if (auth.ok == false) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Log in as Receiver fail ");
    return;
  }
  const hospitalId = e.target.id;
  const unitsReq = 8;
  const res = await fetch(HOST + "bloodinfo.php", {
    method: "POST",
    headers: {
      "req-type": "reqHosp",
    },
    body: JSON.stringify({
      token: token,
      hospitalId: hospitalId,
      unitsReq: unitsReq,
    }),
  });
  const data = await res.json();
  if (data.ok) {
    alert("requset done");
  } else {
    alert(data.msg);
  }
   console.log(typeof data, hospitalId);
}

async function getBloodSamples() {
  const token = localStorage.token;
  const userType = localStorage.userType;
  modifyHeader(token, userType);
  const res = await fetch(HOST + "bloodinfo.php", {
    method: "POST",
    headers: {
      "req-type": "fetch_Blood_Data",
    },
    body: JSON.stringify({
      token: token,
    }),
  });
  const col = [
    "blood_type",
    "units",
    "collection_date",
    "hospital_name",
    "hospital_id",
  ];
  let data;
  try {
    data = await res.json();
  } catch (err) {
    alert("ERROR!!!! " + err.message);
    return;
  }
  console.log(data);
  var div = document.getElementById("tbody");
  data.forEach((row, i) => {
    var tr = document.createElement("tr");
    tr.id = i;
    var td = document.createElement("td");
    td.innerHTML = i + 1;
    tr.appendChild(td);
    col.forEach((c, j) => {
      var td = document.createElement("td");
      var val = document.createTextNode(data[i][c]);
      td.appendChild(val);
      tr.appendChild(td);
    });
    var btn = document.createElement("button");
    btn.textContent = "Make Request";
    btn.classList.add("btn", "btn-info");
    btn.addEventListener("click", reqHosp, false);
    btn.id = data[i]["hospital_id"];
    tr.appendChild(btn);
    div.appendChild(tr);
  });

  if(data.length == 0){
    const el = document.getElementById("caption");
      if(userType=="hospital"){
        el.style.display="";
        el.innerHTML="No data availaible.";
      }
      if(userType=="receiver"){
        el.style.display="";
        el.innerHTML="No blood samples availaible for your blood type.";
      }
  }
}

async function getReceiverreqs() {
  const token = localStorage.token;
  const res = await fetch(HOST + "bloodinfo.php", {
    method: "POST",
    headers: {
      "req-type": "getReceiverReq",
    },
    body: JSON.stringify({
      token: token,
    }),
  });
  let data;
  try {
    data = await res.json();
  } catch (err) {
    alert("ERROR!!!! " + err.message);
    return;
  }
  const col = [
    "receiver_name",
    "phone",
    "receiver_blood_type",
    "units",
    "date",
  ];

  var div = document.getElementById("tbodyHosp");
  data.forEach((row, i) => {
    var tr = document.createElement("tr");
    tr.id = i;
    var td = document.createElement("td");
    td.innerHTML = i + 1;
    tr.appendChild(td);
    col.forEach((c, j) => {
      var td = document.createElement("td");
      var val = document.createTextNode(data[i][c]);
      td.appendChild(val);
      tr.appendChild(td);
    });
    tr.className = "item";
    div.appendChild(tr);
  });
  //  changeHeaders()
  console.log(data);
}

async function submitBloodInfo(form) {
  const token = localStorage.token;

  const bloodInfo = {
    type: form.elements[0].value.trim().toUpperCase(),
    units: form.elements[1].value.trim(),
    date: form.elements[2].value,
    token: token,
  };

  if (!bloodTypes.includes(bloodInfo.type)) {
    const el = document.getElementById("bloodType");
    el.classList.add("is-invalid");
    return false;
  }
  if (isNaN(parseInt(bloodInfo.units))) {
    const el = document.getElementById("units");
    el.classList.add("is-invalid");
    return false;
  }

  if (bloodInfo.date === "") {
    const el = document.getElementById("date");
    el.classList.add("is-invalid");
    return false;
  }
  const res = await fetch(HOST + "bloodinfo.php", {
    method: "POST",
    headers: {
      "req-type": "submitBloodInfo",
    },
    body: JSON.stringify(bloodInfo),
  });
  const data = await res.text();
  console.log(data);
}

async function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userType");
  window.location.replace("login.html");
  return;
}
