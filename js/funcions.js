//Countdown//

function updateCountdown() {
    const targetDate = new Date('2023-12-30T00:00:00').getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
        document.getElementById('countdown').innerHTML = '¡Tiempo terminado!';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days;
    document.getElementById('hours').innerText = hours;
    document.getElementById('minutes').innerText = minutes;
    document.getElementById('seconds').innerText = seconds;
}

updateCountdown(); // Call initially to avoid delay

// Update countdown every second
setInterval(updateCountdown, 1000);

// Mostrar el botón cuando se hace scroll
window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("scrollButton").style.display = "block";
    } else {
        document.getElementById("scrollButton").style.display = "none";
    }
};

// Hacer scroll hacia arriba cuando se hace clic en el botón
document.getElementById("scrollButton").addEventListener("click", function() {
    document.body.scrollTop = 0; // Para navegadores antiguos
    document.documentElement.scrollTop = 0; // Para navegadores modernos
});