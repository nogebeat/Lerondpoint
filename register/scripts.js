document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const registerData = Object.fromEntries(formData.entries());

        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });

        if (response.ok) {
            const responseData = await response.json();
            document.getElementById('message').innerText = responseData.token;
        } else {
            const responseData = await response.json();
            document.getElementById('message').innerText = responseData.msg;
        }
});

