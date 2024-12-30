function getWeather() {
    const apiKey = "f8f08f680aa3e91b582edbf6a0a2b536"; 
    const city = document.getElementById("city").value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Fetch current weather data
    fetch(currWeatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '404') {
                alert(data.message);
                return;
            }
            // Saving current weather data to local storage
            localStorage.setItem('currentWeather', JSON.stringify(data));
            localStorage.setItem('city', city);

            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    // Fetch hourly forecast data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            // saving hourly forecast to local storage
            localStorage.setItem('hourlyForecast', JSON.stringify(data.list));

            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempInfo = document.getElementById('temperature');
    const weatherInfo = document.getElementById('weatherInfo');
    const weatherIcon = document.getElementById('weatherIcon');

    tempInfo.innerHTML = '';
    weatherInfo.innerHTML = '';

    if (data.code === '404') {
        weatherInfo.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        tempInfo.innerHTML = `<p>${temperature}°C</p>`;
        weatherInfo.innerHTML = `<p>${cityName}</p><p>${description}</p>`;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        weatherIcon.style.display = 'block';
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyF = document.getElementById('hourlyForecast');
    hourlyF.innerHTML = ''; // To clear previous data

    const next24hours = hourlyData.slice(0, 8);

    next24hours.forEach(item => {
        const dataTime = new Date(item.dt * 1000);
        const hour = dataTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const hourlyItemHtml = `
        <div class='hourly-item'>
            <span>${hour}:00</span>
            <img src="${iconUrl}" alt="Hourly Weather Icon">
            <span>${temperature}°C</span>
        </div>`;

        hourlyF.innerHTML += hourlyItemHtml;
    });
}

// Load data from local storage on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedCity = localStorage.getItem('city');
    const savedCurrentWeather = localStorage.getItem('currentWeather');
    const savedHourlyForecast = localStorage.getItem('hourlyForecast');

    if (savedCurrentWeather && savedHourlyForecast) {
        displayWeather(JSON.parse(savedCurrentWeather));
        displayHourlyForecast(JSON.parse(savedHourlyForecast));
    }

    if (savedCity) {
        document.getElementById("city").value = savedCity;
    }
});
