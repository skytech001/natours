const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class='alert alert--${type}'>${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, 5000);
};

const login = async (email, password) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/v1/users/login",
      { email, password }
    );
    if (response.data.status === "success") {
      showAlert("success", "You are logged in successfully");
      location.assign("/");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
const form = document.querySelector(".form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

const logout = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/v1/users/logout");
    if (res.data.status === "success") location.reload(true);
  } catch (err) {
    showAlert("error", "Error logging out! Try later");
  }
};

const logOutBtn = document.querySelector(".nav__el--logout");
if (logOutBtn) logOutBtn.addEventListener("click", logout);
