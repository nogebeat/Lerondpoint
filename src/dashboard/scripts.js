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
