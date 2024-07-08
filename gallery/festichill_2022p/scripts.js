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
