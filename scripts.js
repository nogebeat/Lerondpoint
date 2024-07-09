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

let slideIndex = 0;
    const slides = document.querySelector('.slider-image');
    const totalSlides = slides.querySelectorAll('img').length;

    function showSlide(index) {
        if (index < 0) {
            slideIndex = totalSlides - 1;
        } else if (index >= totalSlides) {
            slideIndex = 0;
        } else {
            slideIndex = index;
        }

        const slideWidth = slides.clientWidth;
        slides.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
    }

    function nextSlide() {
        showSlide(slideIndex + 1);
    }

    function prevSlide() {
        showSlide(slideIndex - 1);
    }

    // Automatic slide change (optional)
    setInterval(() => {
        nextSlide();
    }, 3000); // Change slide every 3 seconds
