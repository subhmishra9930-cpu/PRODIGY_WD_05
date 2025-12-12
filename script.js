// OpenWeatherMap API configuration
// Sign up at https://openweathermap.org/api to get your FREE API key
const API_KEY = '7dc0b883fc510fa342ef9012de39254a'; // Your provided API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const weatherForm = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const locationBtn = document.getElementById('location-btn');
const cityName = document.getElementById('city-name');
const dateTime = document.getElementById('date-time');
const weatherIcon = document.getElementById('weather-icon');
const tempValue = document.getElementById('temp-value');
const weatherDesc = document.getElementById('weather-desc');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');

// Event Listeners
weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
    }
});

// Add event listeners to city tags
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('city-tag')) {
        const city = e.target.getAttribute('data-city');
        cityInput.value = city;
        getWeatherByCity(city);
    }
});

locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                getWeatherByCoordinates(latitude, longitude);
            },
            error => {
                hideLoading();
                showError('Unable to retrieve your location. Please enter a city name.');
                console.error('Geolocation error:', error);
            }
        );
    } else {
        showError('Geolocation is not supported by your browser.');
    }
});

// Get weather data by city name
async function getWeatherByCity(city) {
    try {
        showLoading();
        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error(`Weather data not found for "${city}"`);
        }
        
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        hideLoading();
        showError(error.message);
        console.error('Error fetching weather data:', error);
    }
}

// Get weather data by coordinates
async function getWeatherByCoordinates(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error('Weather data not found for your location');
        }
        
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        hideLoading();
        showError(error.message);
        console.error('Error fetching weather data:', error);
    }
}

// Display weather data
function displayWeatherData(data) {
    hideLoading();
    
    // Update city name and date/time
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    dateTime.textContent = getCurrentDateTime();
    
    // Update weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.className = `fas fa-${getWeatherIcon(iconCode)}`;
    
    // Update temperature and description
    tempValue.textContent = Math.round(data.main.temp);
    weatherDesc.textContent = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
    
    // Update weather details
    windSpeed.textContent = `${data.wind.speed} km/h`;
    humidity.textContent = `${data.main.humidity}%`;
    pressure.textContent = `${data.main.pressure} hPa`;
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
}

// Get appropriate weather icon based on OpenWeatherMap icon code
function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': 'sun',
        '01n': 'moon',
        '02d': 'cloud-sun',
        '02n': 'cloud-moon',
        '03d': 'cloud',
        '03n': 'cloud',
        '04d': 'cloud',
        '04n': 'cloud',
        '09d': 'cloud-rain',
        '09n': 'cloud-rain',
        '10d': 'cloud-sun-rain',
        '10n': 'cloud-moon-rain',
        '11d': 'bolt',
        '11n': 'bolt',
        '13d': 'snowflake',
        '13n': 'snowflake',
        '50d': 'smog',
        '50n': 'smog'
    };
    
    return iconMap[iconCode] || 'cloud';
}

// Get current date and time
function getCurrentDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return now.toLocaleDateString('en-US', options);
}

// Show loading indicator
function showLoading() {
    loading.style.display = 'flex';
    errorMessage.style.display = 'none';
}

// Hide loading indicator
function hideLoading() {
    loading.style.display = 'none';
}

// Show error message
function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
}

// Initialize with a default city or user's location
document.addEventListener('DOMContentLoaded', () => {
    // You can set a default city here if desired
    // getWeatherByCity('London');
});