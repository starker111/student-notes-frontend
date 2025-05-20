document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('https://student-notes-backend.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      // You can save the token in localStorage if using JWT
      localStorage.setItem('token', data.token);
      alert('Login successful!');
      window.location.href = 'index.html'; // redirect
    } else {
      document.getElementById('errorMsg').textContent = data.message || 'Login failed';
    }
  } catch (err) {
    document.getElementById('errorMsg').textContent = 'Server error';
  }
});
