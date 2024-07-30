const totalImages = 17;
    const gallery = document.getElementById('gallery');
    for (let i = 1; i <= totalImages; i++) {
        const img = document.createElement('img');
        img.className = 'img-fluid m-2 animate__animated animate__zoomIn';
        img.src = `../../assets/img/festichill_2024/event${i}.jpg`;
        img.alt = 'Le Festichill 2024';
        gallery.appendChild(img);
}