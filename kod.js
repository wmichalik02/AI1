document.addEventListener('DOMContentLoaded', function () {
    // Inicjalizacja mapy Leaflet
    const map = L.map('map').setView([51.505, -0.09], 13); // początkowe współrzędne i poziom powiększenia

    // Dodaj "tile layer" (mapa podstawowa)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Pobranie zgody na lokalizację
    const myLocationBtn = document.getElementById('my-location-btn');
    myLocationBtn.addEventListener('click', getLocation);

    // Pobranie zgody na wyświetlanie powiadomień przy ładowaniu strony
    requestNotificationPermission();

    // Obsługa przemieszczania mapy przy użyciu drag & drop
    const mapContainer = document.getElementById('map-container');
    let isDragging = false;
    let startCoords;

    mapContainer.addEventListener('mousedown', startDragging);
    mapContainer.addEventListener('mousemove', handleDragging);
    mapContainer.addEventListener('mouseup', stopDragging);

    function startDragging(e) {
        isDragging = true;
        startCoords = { x: e.clientX, y: e.clientY };
    }

    function handleDragging(e) {
        if (!isDragging) return;

        const deltaX = e.clientX - startCoords.x;
        const deltaY = e.clientY - startCoords.y;

        map.panBy([deltaY, deltaX], { animate: false });

        startCoords = { x: e.clientX, y: e.clientY };
    }

    function stopDragging() {
        isDragging = false;
    }

    // Pobierz mapę
    const downloadMapBtn = document.getElementById('download-map-btn');
    downloadMapBtn.addEventListener('click', downloadMap);

    function downloadMap() {
        // Pobierz aktualny widok mapy jako obraz rastrowy
        map.getCanvas().toBlob(function (blob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'mapa.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        });
        // Wczytaj pobrany obraz rastrowy
        const image = new Image();
        image.src = URL.createObjectURL(blob);
        document.body.appendChild(image);

        alert("Mapa została pobrana w postaci rastrowej.");
    }

    
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, handleLocationError);
        } else {
            alert("Twoja przeglądarka nie obsługuje Geolocation API.");
        }
    }

    function showPosition(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Wyświetlenie współrzędnych na mapie
        alert(`Twoja aktualna lokalizacja:\nLatitude: ${latitude}\nLongitude: ${longitude}`);

        // Oznaczanie na mapie
        L.marker([latitude, longitude]).addTo(map)
            .bindPopup('Twoja aktualna lokalizacja.')
            .openPopup();
    }

    function handleLocationError(error) {
        // Obsługa błędów pobierania lokalizacji
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("Użytkownik nie udzielił zgody na udostępnienie lokalizacji.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Lokalizacja niedostępna.");
                break;
            case error.TIMEOUT:
                alert("Przekroczono czas oczekiwania na lokalizację.");
                break;
            case error.UNKNOWN_ERROR:
                alert("Wystąpił nieznany błąd.");
                break;
        }
    }

    function requestNotificationPermission() {
        if ('Notification' in window) {
            Notification.requestPermission().then(function (permission) {
                if (permission === 'granted') {
                    console.log("Zgoda na wyświetlanie powiadomień udzielona!");
                } else if (permission === 'denied') {
                    console.log("Użytkownik zablokował wyświetlanie powiadomień.");
                }
            });
        } else {
            console.log("Twoja przeglądarka nie obsługuje Notification API.");
        }
    }
});
