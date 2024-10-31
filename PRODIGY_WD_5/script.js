const apiKey = '8b566966df0a131273224c62adb95df8'; // Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

async function fetchWeather() {
  const locationInput = document.getElementById('location').value.trim();
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = ""; // Clear previous errors

  if (locationInput) {
    // Fetch weather by city name
    await fetchWeatherData({ city: locationInput });
  } else if (navigator.geolocation) {
    // Use geolocation if available and no city input
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await fetchWeatherData({ lat: latitude, lon: longitude });
      },
      () => {
        errorMessage.textContent = "Geolocation not enabled. Please enter a city name.";
      }
    );
  } else {
    errorMessage.textContent = "Please enter a location or enable geolocation.";
  }
}

async function fetchWeatherData({ city = '', lat = '', lon = '' }) {
  const errorMessage = document.getElementById('error-message');
  let url = `${apiUrl}?appid=${apiKey}&units=metric`;

  if (city) {
    url += `&q=${city}`;
  } else if (lat && lon) {
    url += `&lat=${lat}&lon=${lon}`;
  } else {
    errorMessage.textContent = "Invalid location. Please try again.";
    return;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      displayWeather(data);
    } else {
      errorMessage.textContent = data.message || "Location not found. Please try again.";
    }
  } catch (error) {
    errorMessage.textContent = "Unable to fetch weather data. Please check your network or try again later.";
  }
}

function displayWeather(data) {
  const weatherDisplay = document.getElementById('weatherDisplay');
  weatherDisplay.style.display = 'block';

  document.getElementById('cityName').textContent = `Weather in ${data.name}`;
  document.getElementById('weatherDescription').textContent = `Condition: ${data.weather[0].description}`;
  document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
  document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById('windSpeed').textContent = `Wind Speed: ${data.wind.speed} m/s`;
}
