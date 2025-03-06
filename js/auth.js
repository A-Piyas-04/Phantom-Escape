// Handle user authentication
const AUTH_TOKEN_KEY = 'authToken';
const USER_PROFILE_KEY = 'userProfile';

// Function to handle form submission
async function handleFormSubmit(event, isLogin = false) {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    // Validate form before submission
    if (!isLogin) {
        // Registration form validation
        if (password !== form.confirmPassword.value) {
            showError(form, "Passwords do not match");
            return;
        }
        
        if (password.length < 8) {
            showError(form, "Password must be at least 8 characters");
            return;
        }
        
        if (form.username.value.length < 3 || form.username.value.length > 20) {
            showError(form, "Username must be between 3 and 20 characters");
            return;
        }
    }

    try {
        const user = isLogin 
            ? await loginUser(email, password)
            : await registerUser(email, password, form.username.value);

        if (user?.accessToken) {
            localStorage.setItem(AUTH_TOKEN_KEY, user.accessToken);
            // Set Authorization header for future requests
            window.authHeader = {
                'Authorization': `Bearer ${user.accessToken}`,
                'Content-Type': 'application/json'
            };
        }
        // Redirect to homepage after successful authentication
        window.location.href = '../index.html';
    } catch (error) {
        showError(form, error.message);
    }
}

// Function to show error messages
function showError(form, message) {
    const errorElements = form.getElementsByClassName('error-message');
    for (const element of errorElements) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

// Function to check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem(AUTH_TOKEN_KEY) !== null;
}

// Function to handle logout
function logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_PROFILE_KEY);
    window.location.href = '../index.html';
}

// Function to toggle password visibility
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '👁️‍🗨️';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const registerButton = document.querySelector('.register-button');
    const logoutButton = document.querySelector('.logout-button');

    // Handle register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => handleFormSubmit(e, false));
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => handleFormSubmit(e, true));
    }

    // Handle logout button click
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            logout();
        });
    }

    // Update UI based on authentication status
    if (isAuthenticated()) {
        if (registerButton) registerButton.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'block';
    } else {
        if (registerButton) registerButton.style.display = 'block';
        if (logoutButton) logoutButton.style.display = 'none';
    }
});

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('error');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
    }
}





async function registerUser(email, password, username) {
    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password, username })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }
        localStorage.setItem('userProfile', JSON.stringify(data.user));
        return data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

async function loginUser(email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        localStorage.setItem('userProfile', JSON.stringify(data.user));
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}