const HOST = "https://citzenkan.000webhostapp.com/";


async function validateJWT(token) {
  const res = await fetch(HOST+"login.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });
  const data = await res.json();
  return data;
}

async function loginCheck() {
  const token = localStorage.token;
  const userType = localStorage.userType;
  const path = window.location.pathname;

  if (path == "/util_rec.html") {
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
  const email = form.elements[0].value;
  const pass = form.elements[1].value;
  const userType = form.elements[2].checked
    ? form.elements[2].value
    : form.elements[3].value;

  const res = await fetch(HOST+"login.php", {
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
  const data = await res.json();
  console.log(data);
  if (data.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userType", data.userType);
    alert("Login success!");
    if (userType === "hospital") {
      window.location.replace("util_hosp.html");
    }
    if (userType === "receiver") {
      window.location.replace("util_rec.html");
    }
  } else {
    alert(
      "Login Failed! Check email or password \n Error messgae: " + data.msg
    );
  }
}

async function signupHosp(form) {
  const user = {
    hosp: true,
    name: form.elements[0].value,
    email: form.elements[1].value,
    address: form.elements[2].value,
    phone: form.elements[3].value,
    password: form.elements[4].value,
  };
  const res = await fetch(HOST+"signup.php", {
    method: "POST",
    headers: {
      reqType: "signup",
    },
    body: JSON.stringify(user),
  });
  const data = await res.json();
  console.log(data);
  if (data.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userType", data.userType);
    alert("signup success!");
    window.location.replace("util_hosp.html");
  } else {
    alert(
      "signup Failed! Check email or password \n Error messgae: " + data.msg
    );
  }
}

async function signupRec(form) {
  const user = {
    name: form.elements[0].value,
    email: form.elements[1].value,
    phone: form.elements[2].value,
    blood: form.elements[3].value,
    password: form.elements[4].value,
  };
  const res = await fetch(HOST+"signup.php", {
    method: "POST",
    headers: {
      signup: true,
    },
    body: JSON.stringify(user),
  });
  const data = await res.json();
  console.log(data);
  if (data.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userType", data.userType);
    alert("signup success!");
    window.location.replace("util_rec.html");
    alert("signup success!");
  } else {
    alert(
      "signup Failed! Check email or password \n Error messgae: " + data.msg
    );
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
  const res = await fetch(HOST+"bloodinfo.php", {
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
  const data = await res.text();
  console.log(data, hospitalId);
}

async function getBloodSamples() {
  const token = localStorage.token;
  const res = await fetch(HOST+"bloodinfo.php", {
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
  const data = await res.json();
  console.log(data);
  var div = document.getElementById("tbody");
  data.forEach((row, i) => {
    var tr = document.createElement("tr");
    tr.id = i;
    col.forEach((c, j) => {
      var td = document.createElement("td");
      var val = document.createTextNode(data[i][c]);
      td.appendChild(val);
      tr.appendChild(td);
    });
    var btn = document.createElement("button");
    btn.textContent = "CLICK";
    btn.addEventListener("click", reqHosp, false);
    btn.id = data[i]["hospital_id"];
    tr.appendChild(btn);
    div.appendChild(tr);
  });
}

async function getReceiverreqs() {
  const token = localStorage.token;
  const res = await fetch(HOST+"bloodinfo.php", {
    method: "POST",
    headers: {
      "req-type": "getReceiverReq",
    },
    body: JSON.stringify({
      token: token,
    }),
  });
  const data = await res.json();
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
    col.forEach((c, j) => {
      var td = document.createElement("td");
      var val = document.createTextNode(data[i][c]);
      td.appendChild(val);
      tr.appendChild(td);
    });
    div.appendChild(tr);
  });

  console.log(data);
}

async function submitBloodInfo(form) {
  const token = localStorage.token;

  const bloodInfo = {
    type: form.elements[0].value,
    units: form.elements[1].value,
    date: form.elements[2].value,
    token: token,
  };

  const res = await fetch(HOST+"bloodinfo.php", {
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
