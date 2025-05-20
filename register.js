document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('https://student-notes-backend.onrender.com/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Registration successful!');
      window.location.href = 'login.html';
    } else {
      document.getElementById('errorMsg').textContent = data.message || 'Registration failed';
    }
  } catch (err) {
    document.getElementById('errorMsg').textContent = 'Server error';
  }
});
