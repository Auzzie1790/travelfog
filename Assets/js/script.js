var apiKey = "4" + "8" + "0" + "6" + "b" + "8" + "0" + "a" + "8" + "7" + "d" + "4" + "d" + "5" + "f" + "0" + "3" + "2" + "1" + "3" + "f" + "3" + "9" + "8" + "1" + "b" + "4" + "7" + "9" + "9" + "a" + "d";
var articleEl = document.querySelector("article");
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");
var searchHistory = [];
var searchHistoryEl = document.querySelector("#search-history");

var formSubmitHandler = function(event) {
    event.preventDefault();

    articleEl.innerHTML = "";

    var city = cityInputEl.value.trim();

    var saveCity = true;

    if(city) {
        getLocation(city);
        cityInputEl.value = "";

        for(var i = 0; i < searchHistory.length; i++){
            if(city === searchHistory[i]) {
                saveCity = false;
            }
        }

        if(saveCity === true) {
            searchHistory.push(city);
        }

        if(searchHistory.length === 9) {
            for(var i = 0; i < 8; i++) {
                searchHistory[i] = searchHistory[i + 1];
            }

            searchHistory.splice(-1);
        }

        localStorage.setItem("city-history", JSON.stringify(searchHistory));

        displaySearchHistory();
    } else {
        articleEl.innerHTML = "<h3 class='alert'>Please enter a city</h3>";
    }
};

var searchButtonHandler = function(event) {
    var targetEl = event.target;

    if(targetEl.matches("button")) {
        articleEl.innerHTML = "";

        var city = targetEl.textContent;

        if(city) {
            getLocation(city);
        } else {
            articleEl.innerHTML = "<h3 class='alert'>If you see this text, you've just encountered a bug that may need to be fixed. <a href='https://github.com/JEC6789/weather-dashboard/issues' target='_blank'>Please report this issue on GitHub</a> so I can look into it further.";
        }
    }
};

var getLocation = function(city) {
    var geoApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;

    fetch(geoApiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(geoData) {
                getWeatherData(geoData);
            });
        } else {
            articleEl.innerHTML = "<h3 class='alert'>Somebody just got diagnosed with skill issue. Could be you, could be me, could be the API I'm getting the data you requested from. It doesn't matter who has skill issue in the end though, as it is a disease that stops everything in its tracks. Maybe try submitting that city again and see if it changes anything.</h3>";
        }
    });
};

var getWeatherData = function(geoData) {
    var oneCallApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + geoData[0].lat + "&lon=" + geoData[0].lon + "&units=imperial&appid=" + apiKey;

    fetch(oneCallApiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(weatherData) {
                displayWeatherData(geoData, weatherData);
            });
        } else {
            articleEl.innerHTML = "<h3 class='alert'>Somebody just got diagnosed with skill issue. Could be you, could be me, could be the API I'm getting the data you requested from. It doesn't matter who has skill issue in the end though, as it is a disease that stops everything in its tracks. Maybe try submitting that city again and see if it changes anything.</h3>";
        }
    });
};

var displayWeatherData = function(geoData, weatherData) {
    var currentDate = new Date();

    var currentWeatherEl = document.createElement("section")
    currentWeatherEl.className = "current";
    var headerEl = document.createElement("div");
    headerEl.className = "header";

    var headerTextEl = document.createElement("h2");
    headerTextEl.textContent = geoData[0].name + " (" + String(currentDate.getMonth() + 1).padStart(2, '0') + "/" + String(currentDate.getDate()).padStart(2, '0') + "/" + currentDate.getFullYear() + ")";
    headerEl.appendChild(headerTextEl);

    var imageEl = document.createElement("img");
    imageEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherData.current.weather[0].icon + "@2x.png");
    headerEl.appendChild(imageEl);
    currentWeatherEl.appendChild(headerEl);

    var currentTempEl = document.createElement("p");
    currentTempEl.textContent = "Temp: " + weatherData.current.temp + "°F";
    currentWeatherEl.appendChild(currentTempEl);

    var currentWindEl = document.createElement("p");
    currentWindEl.textContent = "Wind: " + weatherData.current.wind_speed + " MPH";
    currentWeatherEl.appendChild(currentWindEl);

    var currentHumidityEl = document.createElement("p");
    currentHumidityEl.textContent = "Humidity: " + weatherData.current.humidity + " %";
    currentWeatherEl.appendChild(currentHumidityEl);

    var currentUVEl = document.createElement("p");
    currentUVEl.textContent = "UV Index: ";

    var UVColorEl = document.createElement("span");
    if(weatherData.current.uvi < 3) {
        UVColorEl.className = "low";
    } else if(weatherData.current.uvi < 6) {
        UVColorEl.className = "moderate";
    } else if(weatherData.current.uvi < 8) {
        UVColorEl.className = "high";
    } else if(weatherData.current.uvi <= 10) {
        UVColorEl.className = "very-high";
    } else {
        UVColorEl.className = "extreme";
    }
    UVColorEl.textContent = weatherData.current.uvi;
    currentUVEl.appendChild(UVColorEl);
    currentWeatherEl.appendChild(currentUVEl);
    articleEl.appendChild(currentWeatherEl);

    var forecastHeaderEl = document.createElement("h3");
    forecastHeaderEl.textContent = "5-Day Forecast:";
    articleEl.appendChild(forecastHeaderEl);

    var forecastContainerEl = document.createElement("section");
    forecastContainerEl.className = "forecast-container";

    for(var i = 0; i < 5; i++) {
        var forecastCardEl = document.createElement("div");
        forecastCardEl.className = "forecast-card";

        var forecastDate = new Date();
        forecastDate.setDate(forecastDate.getDate() + i + 1);

        var forecastDateEl = document.createElement("h4");
        forecastDateEl.textContent = String(forecastDate.getMonth() + 1).padStart(2, '0') + "/" + String(forecastDate.getDate()).padStart(2, '0') + "/" + forecastDate.getFullYear();
        forecastCardEl.appendChild(forecastDateEl);

        var forecastImageEl = document.createElement("img");
        forecastImageEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherData.daily[i].weather[0].icon + "@2x.png");
        forecastCardEl.appendChild(forecastImageEl);

        var forecastTempEl = document.createElement("p");
        forecastTempEl.textContent = "Temp: " + weatherData.daily[i].temp.max + " °F";
        forecastCardEl.appendChild(forecastTempEl);

        var forecastWindEl = document.createElement("p");
        forecastWindEl.textContent = "Wind: " + weatherData.daily[i].wind_speed + " MPH";
        forecastCardEl.appendChild(forecastWindEl);

        var forecastHumidityEl = document.createElement("p");
        forecastHumidityEl.textContent = "Humidity: " + weatherData.daily[i].humidity + " %";
        forecastCardEl.appendChild(forecastHumidityEl);

        forecastContainerEl.appendChild(forecastCardEl);
    }

    articleEl.appendChild(forecastContainerEl);
};

var loadSearchHistory = function() {
    var savedHistory = localStorage.getItem("city-history");
    if(!savedHistory) {
        return false;
    }

    searchHistory = JSON.parse(savedHistory);

    displaySearchHistory();
};

var displaySearchHistory = function() {
    searchHistoryEl.innerHTML = "";

    for(var i = searchHistory.length - 1; i >= 0; i--) {
        var historyItemEl = document.createElement("button");
        historyItemEl.textContent = searchHistory[i];
        searchHistoryEl.appendChild(historyItemEl);
    }
};

searchHistoryEl.addEventListener("click", searchButtonHandler);
cityFormEl.addEventListener("submit", formSubmitHandler);
loadSearchHistory();