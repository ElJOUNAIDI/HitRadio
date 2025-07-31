// input and button search
const City_input = document.querySelector(".form-control");
const Search_btn = document.querySelector(".Search_btn");
// affichage location
const location_name_elements = document.querySelectorAll(".location_date");
// affichage temperature
const temperature1 = document.querySelectorAll(".temperature");
// affichage description
const description = document.querySelector(".description");
// Humidity and wind
const humidity1 = document.querySelector(".humidity_number");
const windSpeed = document.querySelector(".wind_number");
// Weather img
const weather_img = document.querySelector(".img_weatherw_img");
// forecast items cards
const forecast_items = document.querySelector(".forecast_cards");
// api key
const API_KEY = "b25ff00995790f83b8114ff7572487f6";
// Search button event listener
Search_btn.addEventListener("click", (e) => {
  e.preventDefault();
  if (City_input.value.trim() != "") {
    UpdateWeather(City_input.value);
    UpdateForecast(City_input.value);
    City_input.value = "";
  } else {
    alert("Please enter a city name.");
  }
});
// City input event listener
City_input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && City_input.value.trim() != "") {
    e.preventDefault(City_input.value);
    UpdateWeather();
    City_input.value = "";
  }
});
// Fetch data function
async function getFetchData(endPoint, city) {
  const ApiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${API_KEY}&units=metric`;
  const response = await fetch(ApiUrl);
  // Check if the response is not ok (city not found)
  if (!response.ok) {
    document.querySelector(".not_found").classList.remove("d-none");
    document.querySelector("main").classList.add("d-none");
    return;
  }
  // If the response is ok, parse the JSON data
  const data = await response.json();
  document.querySelector(".not_found").classList.add("d-none");
  document.querySelector("main").classList.remove("d-none");
  return data;
}
// Update weather function
async function UpdateWeather(city) {
  const WeatherData = await getFetchData("weather", city);
  console.log(WeatherData);
  const {
    name: country,
    main: { temp, humidity },
    wind: { speed },
    weather: [{ id, main }],
  } = WeatherData;
  // location name
  updateLocationName(country);
  // temperature
  updateTemperature(temp);
  // description
  description.textContent = main;
  // humidity
  humidity1.textContent = `${humidity}%`;
  // wind speed
  windSpeed.textContent = `${Math.round(speed)} km/h`;
  // weather image
  weather_img.src = `./image/weather/${getWeatherImage(id)}`;
}
// Update location name function
function updateLocationName(name) {
  location_name_elements.forEach((element) => {
    element.textContent = name;
  });
}
// Update temperature function
function updateTemperature(temp) {
  temperature1.forEach((element) => {
    element.textContent = Math.round(temp) + "°C";
  });
}
// Get weather image function
function getWeatherImage(id) {
  if (id <= 232) {
    return "thunderstorm.svg";
  } else if (id <= 321) {
    return "drizzle.svg";
  } else if (id <= 531) {
    return "rain.svg";
  } else if (id <= 622) {
    return "snow.svg";
  } else if (id <= 781) {
    return "atmosphere.svg";
  } else if (id === 800) {
    return "clear.svg";
  } else if (id >= 801 && id <= 804) {
    return "clouds.svg";
  }
}
// Update Forecast function
async function UpdateForecast(city) {
  const ForecastData = await getFetchData("forecast", city);
  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];
  forecast_items.innerHTML = "";
  ForecastData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      // Update forecast item
      UpdateForecastItem(forecastWeather);
    }
  });
  // console.log(todayDate);
}
// Update Forecast Item function
function UpdateForecastItem(weatherData) {
  const {
    main: { temp },
    weather: [{ id, main }],
    dt_txt,
  } = weatherData;
  const forecastItem = document.createElement("div");
  forecastItem.classList.add("card");

  forecastItem.innerHTML = `
    <img src="./image/weather/${getWeatherImage(id)}" alt="" />
    <p>${new Date(dt_txt).toLocaleDateString()}</p>
    <span>${Math.round(temp)}°C</span>
  `;
  forecast_items.insertAdjacentElement("beforeend", forecastItem);
}
// Dark mode toggle
const icon_dark_mode = document.querySelector(".icon_dark_mode");
const icon_light_mode = document.querySelector(".icon_light_mode");
icon_dark_mode.addEventListener("click", () => {
  document.body.classList.add("Dark_Mode");
  icon_dark_mode.style.display = "none";
  icon_light_mode.style.display = "block";
});
icon_light_mode.addEventListener("click", () => {
  document.body.classList.remove("Dark_Mode");
  icon_dark_mode.style.display = "block";
  icon_light_mode.style.display = "none";
});
