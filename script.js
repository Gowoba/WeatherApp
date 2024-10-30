import API_KEY from "./secret.js";


window.getWeather = getWeather;

function getWeather(tempDivId, weatherInfoId, weatherIconId, hourlyForecastId, cityID) {
    const apiKey = API_KEY; // Usa a chave da API importada
    let city; // Declare a variável `city`

    // Define a cidade com base no cityID
    if (cityID === 'RJ') {
        city = 'Rio de Janeiro';
    } else if (cityID === 'SP') {
        city = 'São Paulo';
    } else {
        city = document.getElementById(cityID).value;
    }

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Chamada para a API do tempo atual
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data, tempDivId, weatherInfoId, weatherIconId, hourlyForecastId);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    // Chamada para a API da previsão
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list, hourlyForecastId);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data, tempDivId, weatherInfoId, weatherIconId, hourlyForecastId) {
    const tempDivInfo = document.getElementById(tempDivId);
    const weatherInfoDiv = document.getElementById(weatherInfoId);
    const weatherIcon = document.getElementById(weatherIconId);
    const hourlyForecastDiv = document.getElementById(hourlyForecastId);

    // Limpa o conteúdo anterior
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Converte para Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `<p>${temperature}°C</p>`;
        const weatherHtml = `<p>${cityName}</p><p>${description}</p>`;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage(weatherIconId);
    }
}

function displayHourlyForecast(hourlyData, hourlyForecastId) {
    const hourlyForecastDiv = document.getElementById(hourlyForecastId);
    const next24Hours = hourlyData.slice(0, 8); // Exibe as próximas 24 horas

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage(weatherIconId) {
    const weatherIcon = document.getElementById(weatherIconId);
    weatherIcon.style.display = 'block'; // Torna a imagem visível
}
