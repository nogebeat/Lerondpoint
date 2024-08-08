document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const registerData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });

        
        if (response.ok) {
            const responseData = await response.json();
            document.getElementById('message').innerText = responseData.token;
            if (response.status === 202) {
                localStorage.setItem('token', responseData.token);
                window.location.href = '/dashboard';
            } else {
                alert(responseData.msg);
            }

        } else {
            const responseData = await response.json();
            document.getElementById('message').innerText = responseData.msg;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').innerText = "An error occurred. Please try again later.";
    }
});

if (window.location.pathname === '/dashboard') {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login';
    } else {
        fetch('/dashboard', {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.msg === "Token invalide") {
                window.location.href = '/login';
            } else {
                document.getElementById('userId').innerText = data.userId;
            }
        });
    }
}
