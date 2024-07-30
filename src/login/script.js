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
        } else {
            const responseData = await response.json();
            document.getElementById('message').innerText = responseData.msg;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').innerText = "An error occurred. Please try again later.";
    }
});

