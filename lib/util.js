async function searchBlooadSampleTable() {
  var _input = document.getElementById("searchBar");
  const input = _input.value.toUpperCase();
  const table = document.getElementById("bloodInfoTable");
  const tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    const td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      const txt = td.textContent || td.innerText;
      if (txt.toUpperCase().indexOf(input) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
  console.log("dasd");
}

async function togglePassword() {
  //e.preventDefault();
  const inputPassword = document.getElementById("password");
  const eyeIcon = document.getElementById("eyeIcon");
  const type = inputPassword.type;
  if (type === "password") {
    inputPassword.type = "text";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
  } else {
    inputPassword.type = "password";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");
  }
}

async function hideErrorMsg(e) {
  const id = e.id;
  const el = document.getElementById(id);
  el.classList.remove("is-invalid");
}

async function validateForm(user) {
  const phone = user.phone;
  const password = user.password;
  const validPhone = /^\d+$/.test(phone) && phone.length === 10;
  const validPassword =
    /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(password) &&
    password.length >= 6;

  if (!validPhone) {
    const el = document.getElementById("phone");
    el.classList.add("is-invalid");
    // alert("");
    return false;
  }
  if (!validPassword) {
    const el = document.getElementById("password");
    el.classList.add("is-invalid");
    return false;
  }
  console.log("sadad");
  return true;
}

async function modifyHeader(token, userType) {
  if (token !== undefined) {
    const loginHref = document.getElementById("loginHref");
    loginHref.style.display = "none";

    const hospSignup = document.getElementById("hospSignup");
    hospSignup.style.display = "none";

    const recSignup = document.getElementById("recSignup");
    recSignup.style.display = "none";

    return false;
  }
  const logoutHref = document.getElementById("logoutHref");
  logoutHref.style.display = "none";

  return true;
}
