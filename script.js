document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const showRegister = document.getElementById("show-register");
    const showLogin = document.getElementById("show-login");

    showRegister.addEventListener("click", function (event) {
        event.preventDefault();  // Stop # from appearing in URL
        loginForm.classList.remove("active");
        registerForm.classList.add("active");
    });

    showLogin.addEventListener("click", function (event) {
        event.preventDefault();
        registerForm.classList.remove("active");
        loginForm.classList.add("active");
    });
});
