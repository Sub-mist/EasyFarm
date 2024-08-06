const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

const signUpBtn = document.getElementById('signUpBtn');

signUpBtn.addEventListener('click', (event) => {
    const name = document.getElementById('name');
    const email = document.getElementById('signup-email');
    const password = document.getElementById('signup-password');
    const cPassword = document.getElementById('signup-cpassword');

    if (!name.value || !email.value || !password.value || !cPassword.value) {
        event.preventDefault();
        alert("Please fill out all fields.");
        return;
    }

    if (password.value != cPassword.value) {
        event.preventDefault();
        alert("Passwords do not match. Please enter again.");
    }
});

const signInBtn = document.getElementById('signInBtn');

signInBtn.addEventListener('click', (event) => {
    const email = document.getElementById('signin-email');
    const password = document.getElementById('signin-password');

    if (!email.value || !password.value) {
        event.preventDefault();
        alert("Please fill out all fields.");
        return;
    }

});


