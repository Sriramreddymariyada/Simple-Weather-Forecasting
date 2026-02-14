
const API_KEY = "40f98b35470f513aeec0078a899eb167";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";


const UNITS = "metric";


// Input and button
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

// Display sections
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const weatherDisplay = document.getElementById("weatherDisplay");

// Weather data elements
const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const weatherCondition = document.getElementById("weatherCondition");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");
const errorMessage = document.getElementById("errorMessage");



// When user clicks the Search button
searchBtn.addEventListener("click", function() {
    const city = cityInput.value.trim(); 
    
    // Check if user entered something
    if (city === "") {
        showError("Please enter a city name!");
        return; // Stop execution
    }
    
    // If valid input, fetch weather data
    getWeather(city);
});

// Allow user to press Enter key to search (instead of clicking button)
cityInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchBtn.click(); // Trigger the search button click
    }
});

/*fetching data from api*/

async function getWeather(city) {
    showLoading();
    
    const url = `${API_URL}?q=${city}&units=${UNITS}&appid=${API_KEY}`;
    
    try {
        
        const response = await fetch(url);
        
       
        if (!response.ok) {
            // HTTP error (404, 500, etc.)
            if (response.status === 404) {
                throw new Error("City not found! Please check the spelling.");
            } else if (response.status === 401) {
                throw new Error("Invalid API key! Please check your API_KEY in script.js");
            } else {
                throw new Error("Unable to fetch weather data. Please try again.");
            }
        }
        
        const data = await response.json();
        
        displayWeather(data);
        
    } catch (err) {
        console.error("Error fetching weather:", err);
        showError(err.message);
    }
}


function displayWeather(data) {
    loading.classList.add("hidden");
    error.classList.add("hidden");
    
   
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    
    temp.textContent = Math.round(data.main.temp);
    
    // Weather condition (e.g., "Clouds", "Rain")
    weatherCondition.textContent = data.weather[0].description;
    
    // Feels like temperature
    const feelsLikeTemp = Math.round(data.main.feels_like);
    feelsLike.textContent = `${feelsLikeTemp}°${UNITS === "metric" ? "C" : "F"}`;
    
    // Humidity percentage
    humidity.textContent = `${data.main.humidity}%`;
    
    // Wind speed
    windSpeed.textContent = `${data.wind.speed} ${UNITS === "metric" ? "m/s" : "mph"}`;
    
    // Atmospheric pressure
    pressure.textContent = `${data.main.pressure} hPa`;
    
    // Show the weather display section
    weatherDisplay.classList.remove("hidden");
}

// Function to show loading indicator
function showLoading() {
    loading.classList.remove("hidden");
    error.classList.add("hidden");
    weatherDisplay.classList.add("hidden");
}

// Function to show error message
function showError(message) {
    loading.classList.add("hidden");
    weatherDisplay.classList.add("hidden");
    errorMessage.textContent = message;
    error.classList.remove("hidden");
}

