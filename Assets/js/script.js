var JECApiKey = "4" + "8" + "0" + "6" + "b" + "8" + "0" + "a" + "8" + "7" + "d" + "4" + "d" + "5" + "f" + "0" + "3" + "2" + "1" + "3" + "f" + "3" + "9" + "8" + "1" + "b" + "4" + "7" + "9" + "9" + "a" + "d";
var weatherSectionEl = document.querySelector("#weather-container");
var formEl = document.querySelector("form");
var homeInputEl = document.querySelector("#home");
var destinationInputEl = document.querySelector("#destination");
var warningEl = document.querySelector("#warning");
var lat = 38.8950368;
var lng = -77.0365427;
var getLocalStorage = function() {
    var home = localStorage.getItem('home')
    var destination = localStorage.getItem('destination')
    if (home&&destination){
        getLocation(home, false);
        getLocation(destination, true);
    }
}

var formSubmitHandler = function(event) {
    event.preventDefault();

    warningEl.innerHTML = "";

    var home = homeInputEl.value.trim();
    var destination = destinationInputEl.value.trim();

    if(!home || !destination) {
        if(!home && destination) {
            warningEl.innerHTML = "<p>Please enter your starting location</p>";
        } else if(home && !destination) {
            warningEl.innerHTML = "<p>Please enter your destination</p>";
        } else {
            warningEl.innerHTML = "<p>Please enter your starting location and destination</p>";
        }
    } else if(home === destination) {
        warningEl.innerHTML = "<p>Please enter different values for your starting location and destination</p>";
    } else {
        localStorage.setItem('home', home);
        weatherSectionEl.innerHTML = "";
        getLocation(home, false);
        homeInputEl.value = "";
        localStorage.setItem('destination', destination)
        getLocation(destination, true);
        destinationInputEl.value = "";
    }
};


var getLocation = function(city, destination) {
    var arr = city.split(' ');
    console.log(arr);
    var geoApiUrl = ""
    if(arr.length>1){
        if(arr[arr.length-1].length===2){
            var cityName = arr.slice(0,arr.length-1).join(' ' )
             geoApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "," + arr[arr.length-1] + ",US" + "&limit=1&appid=" + JECApiKey;
        }
        else{
            geoApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + JECApiKey;
        }
        
    }

    else{
        geoApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + JECApiKey
    }
console.log(geoApiUrl)
    fetch(geoApiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(geoData) {
                if(geoData.length === 0) {
                    var noResultWarning = document.createElement("p");
                    noResultWarning.textContent = 'No results found for "' + city + '"';
                    warningEl.appendChild(noResultWarning);
                } else {
                    getWeatherData(geoData);
                    if(destination === true) {
                        lat = geoData[0].lat;
                        lng = geoData[0].lon;
                        initialize();
                    }
                }
            });
        } else {
            warningEl.innerHTML = "<p>Somebody just got diagnosed with skill issue. Could be you, could be me, could be the API I'm getting the data you requested from. It doesn't matter who has skill issue in the end though, as it is a disease that stops everything in its tracks. Maybe try submitting that city again and see if it changes anything.</p>";
        }
    });
};

var getWeatherData = function(geoData) {
    var oneCallApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + geoData[0].lat + "&lon=" + geoData[0].lon + "&units=imperial&appid=" + JECApiKey;

    fetch(oneCallApiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(weatherData) {
                displayWeatherData(geoData, weatherData);
            });
        } else {
            warningEl.innerHTML = "<p>Somebody just got diagnosed with skill issue. Could be you, could be me, could be the API I'm getting the data you requested from. It doesn't matter who has skill issue in the end though, as it is a disease that stops everything in its tracks. Maybe try submitting that city again and see if it changes anything.</p>";
        }
    });
};

var displayWeatherData = function(geoData, weatherData) {
    var currentDate = new Date();
    
    var weatherDataEl = document.createElement("div")
    weatherDataEl.className = "card ml-3";
    var currentWeatherEl = document.createElement("div");
    currentWeatherEl.className = "card-content pt-4 pb-3";
    var currentHeaderEl = document.createElement("div");
    currentHeaderEl.className = "media mb-3 is-align-items-center";

    var imageEl = document.createElement("div");
    imageEl.className = "media-left";
    imageEl.innerHTML = "<figure class='image is-48x48'><img src='https://openweathermap.org/img/wn/" + weatherData.current.weather[0].icon + "@2x.png'></figure>";
    currentHeaderEl.appendChild(imageEl);

    var headerTextEl = document.createElement("div");
    headerTextEl.className = "media-content title is-5";
    headerTextEl.textContent = geoData[0].name + " (" + String(currentDate.getMonth() + 1).padStart(2, '0') + "/" + String(currentDate.getDate()).padStart(2, '0') + "/" + currentDate.getFullYear() + ")";
    currentHeaderEl.appendChild(headerTextEl);

    currentWeatherEl.appendChild(currentHeaderEl);

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
    currentUVEl.textContent = "UV Index: " + weatherData.current.uvi;
    currentWeatherEl.appendChild(currentUVEl);
    weatherDataEl.appendChild(currentWeatherEl);

    var futureWeatherEl = document.createElement("div");
    futureWeatherEl.className = "card-content pt-3"
    var forecastHeaderEl = document.createElement("div");
    forecastHeaderEl.className = "title is-6";
    forecastHeaderEl.textContent = "5-Day Forecast:";
    futureWeatherEl.appendChild(forecastHeaderEl);

    var forecastContainerEl = document.createElement("div");
    forecastContainerEl.className = "is-flex is-flex-wrap-wrap is-justify-content-space-around";

    for(var i = 0; i < 5; i++) {
        var forecastDayEl = document.createElement("div");

        var forecastSubheaderEl = document.createElement("div");
        forecastSubheaderEl.className = "media is-align-items-center";

        var forecastImageEl = document.createElement("div");
        forecastImageEl.className = "media-left";
        forecastImageEl.innerHTML = "<figure class='image is-32x32'><img src='https://openweathermap.org/img/wn/" + weatherData.daily[i].weather[0].icon + "@2x.png'></figure>";
        forecastSubheaderEl.appendChild(forecastImageEl);

        var forecastDate = new Date();
        forecastDate.setDate(forecastDate.getDate() + i + 1);

        var forecastDateEl = document.createElement("h4");
        forecastDateEl.textContent = String(forecastDate.getMonth() + 1).padStart(2, '0') + "/" + String(forecastDate.getDate()).padStart(2, '0') + "/" + forecastDate.getFullYear();
        forecastSubheaderEl.appendChild(forecastDateEl);
        forecastDayEl.appendChild(forecastSubheaderEl);

        var forecastTempEl = document.createElement("p");
        forecastTempEl.textContent = "Temp: " + weatherData.daily[i].temp.max + " °F";
        forecastDayEl.appendChild(forecastTempEl);

        var forecastWindEl = document.createElement("p");
        forecastWindEl.textContent = "Wind: " + weatherData.daily[i].wind_speed + " MPH";
        forecastDayEl.appendChild(forecastWindEl);

        var forecastHumidityEl = document.createElement("p");
        forecastHumidityEl.className = "mb-4";
        forecastHumidityEl.textContent = "Humidity: " + weatherData.daily[i].humidity + " %";
        forecastDayEl.appendChild(forecastHumidityEl);
        forecastContainerEl.appendChild(forecastDayEl);
    }

    futureWeatherEl.appendChild(forecastContainerEl);
    weatherDataEl.appendChild(futureWeatherEl);
    weatherSectionEl.appendChild(weatherDataEl);
};

//begin pano map

function initialize() {
    var place = { lat , lng }
    const map = new google.maps.Map(document.getElementById("map"), {
      center: place,
      zoom: 14,
    });
    const panorama = new google.maps.StreetViewPanorama(
      document.getElementById("pano"),
      {
        position: place,
        pov: {
          heading: 34,
          pitch: 10,
        },
      }
    );
  
    map.setStreetView(panorama);
}
getLocalStorage()
formEl.addEventListener("submit", formSubmitHandler);
