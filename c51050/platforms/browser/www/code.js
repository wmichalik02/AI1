document.addEventListener('DOMContentLoaded', function () {
    const locationInput = document.getElementById('locationInput');
    const weatherButton = document.getElementById('weatherButton');
    const weatherInfo = document.getElementById('weatherInfo');
    const forecastInfo = document.getElementById('forecastInfo');

    // Funkcja konwersji z Fahrenheitów na stopnie Celsiusza
    function convertToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }

    weatherButton.addEventListener('click', function () {
        const location = locationInput.value;

        if (location) {
            // Wysyłamy żądanie do API Current Weather za pomocą XMLHttpRequest
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=7ded80d91f2b280ec979100cc8bbba94`, true);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    const responseData = JSON.parse(xhr.responseText);
                    console.log(responseData);
                    const tempCelsius = responseData.main.temp - 273.15;
                    // Wyczyszczenie poprzednich informacji na stronie
                    weatherInfo.innerHTML = '';
                    // Konwersja temperatury z Kelvinów na stopnie Celsiusza
                    const currentWeatherContainer = document.createElement('div');
                    currentWeatherContainer.classList.add('forecast-item'); // Dodaj klasę forecast-item
                    currentWeatherContainer.innerHTML = `
                        <div class="weather-icon">
                            <img class="weather-icon-img" src="https://openweathermap.org/img/wn/${responseData.weather[0].icon}.png" alt="Weather Icon">
                        </div>
                        <div class="weather-details">
                            <h2>Current Weather</h2>
                            <p>Temperature: ${tempCelsius.toFixed(2)} &deg;C (${convertToFahrenheit(tempCelsius).toFixed(2)} &deg;F)</p>
                            <p>Weather: ${responseData.weather[0].description}</p>
                        </div>
                        <hr>
                    `;
                    weatherInfo.appendChild(currentWeatherContainer);
                } else {
                    console.error('Error:', xhr.statusText);
                }
            };
            xhr.onerror = function () {
                console.error('Request failed');
            };
            xhr.send();

            // Wysyłamy żądanie do API 5-day Forecast za pomocą Fetch API
            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=7ded80d91f2b280ec979100cc8bbba94`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);

                    // Wyczyszczenie poprzednich prognoz na stronie
                    forecastInfo.innerHTML = '';

                    // Wyświetlenie prognozy na stronie
                    const forecastTitle = document.createElement('h2');
                    forecastTitle.textContent = 'Weather Forecast';
                    forecastInfo.appendChild(forecastTitle);

                    data.list.forEach(item => {
                        const tempCelsius = item.main.temp - 273.15;
                        const tempFahrenheit = convertToFahrenheit(tempCelsius);
                    
                        const forecastItem = document.createElement('div');
                        forecastItem.classList.add('forecast-item'); // Dodaj klasę forecast-item
                        forecastItem.innerHTML = `
                            <div class="weather-icon">
                                <img class="weather-icon-img" src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="Weather Icon">
                            </div>
                            <div class="weather-details">
                                <p>Date: ${item.dt_txt}</p>
                                <p>Temperature: ${tempCelsius.toFixed(2)} &deg;C (${tempFahrenheit.toFixed(2)} &deg;F)</p>
                                <p>Weather: ${item.weather[0].description}</p>
                            </div>
                            <hr>
                        `;
                        forecastInfo.appendChild(forecastItem);
                    });
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                });
        } else {
            console.error('Please enter a location');
        }
    });
});
