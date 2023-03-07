const updateSettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "/api/v1/users/updateMyPassword"
        : "/api/v1/users/updateMe";

    const response = await axios.patch(url, data);
    if (response.data.status === "success") {
      return showAlert("success", `Your ${type} has been updated successfully`);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};

const updateForm = document.querySelector(".form-user-data");
if (updateForm) {
  updateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    //create multipart formdata to use multer in api for photo.
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);

    updateSettings(form, "account");
  });
}

const updatePassword = document.querySelector(".form-user-settings");
if (updatePassword) {
  updatePassword.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "UPDATING...";

    const currentPassword = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await updateSettings(
      { currentPassword, password, passwordConfirm },
      "password"
    );
    document.querySelector(".btn--save-password").textContent = "SAVE PASSWORD";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}
