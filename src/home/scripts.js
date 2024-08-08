document.getElementById('login').addEventListener('click', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login';
    } else {
        fetch('/validate-token', {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.valid) {
                window.location.href = '/dashboard';
            } else {
                window.location.href = '/login';
            }
        })
        .catch(error => {
            console.error('Error validating token:', error);
            window.location.href = '/login.html';
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        if (name && email && message) {
            alert('Merci pour votre message ! Nous vous répondrons bientôt.');
            form.reset();
        } else {
            alert('Veuillez remplir tous les champs.');
        }
    });
});

let i = 0;
    const imgs = document.querySelector('.slider-image');
    const tot = imgs.querySelectorAll('img').length;

    function affimg(index) {
        if (index < 0)
            i = tot - 1;
        else if (index >= tot)
            i = 0;
        else
            i = index;
        const slideWidth = imgs.clientWidth;
        imgs.style.transform = `translateX(-${i * slideWidth}px)`;
    }

    function next() {
        affimg(i + 1);
    }

    function prev() {
        affimg(i - 1);
    }

    setInterval(() => {
        next();
    }, 5000);
