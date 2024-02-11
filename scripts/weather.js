// Declared variables that take the HTML elements already created to use in functions
const weatherDesc = document.querySelector('#weatherDescription');
const weatherIcon = document.querySelector('#weatherIcon');
const dateHTML = document.querySelector("#currentDate");
const weatherContainer = document.querySelector("#weather");
const forecastContainer = document.querySelector("#forecastContainer");
const weatherButton = document.querySelector("#weatherButton");

// Creating a date object to get the current date
const date = new Date();

// Here I'm defining a global variable which will help with Fetching APIs later on
var weatherURL;
var forecastURL;

// This adds an event to the weather button found in the webpage. This event
// gets the name of the city typed by the user, and uses it to call a Geocoding
// API in order to get the latitude and longitude to get the weather forecast
// using another API
weatherButton.addEventListener("click",() => {
    var city = document.getElementById('cityInput').value;
    var url = 'http://api.openweathermap.org/geo/1.0/direct?q='+ city +'&limit=1&appid=3637031259467a0e65ab88aab5bc72ac';
    geocodingFetch(url);
});

// This funcion fetches the data on the Weather API according to the weather URL provided
// after this, this function also uses the displayWeather function to modify the
// HTML with data of the current weather in the city.
async function apiFetch(url){
    try {
        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            displayWeather(data);
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.log(error);
    }
}

// This function fetches the data on the Forecast API according to the URL provided
// after this, this function uses the displayWeatherForecast function, which adds elements
// to the HTML, to provide the user with a forecast of the next 3 days
async function forecastFetch(url){
    try {
        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            displayWeatherForecast(data.list);
        } else {
            throw Error(await response.text());
        }

    } catch (error) {
        console.log(error);
    }
}

// This function fetches the data on the Geocoding API according to the URL provided
// after this, it gets the latitude and longitude of the city typed by the user and uses
// this information to call the apiFetch, and forecastFetch functions, which get the 
// current weather and a forecast of the next 3 days.
async function geocodingFetch(url){

    try {
        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            getURLs(data[0].lat,data[0].lon);
            apiFetch(weatherURL);
            forecastFetch(forecastURL);
        } else {
            throw Error(await response.text());
        }

    } catch (error) {
        console.log(error);
    }
}

// To call the APIs, you need to use a URL, this function modify the weatherURL and forecastURL
// global variables to get the links used to fetch the weather and forecast APIs
function getURLs(lat, lon){
    weatherURL = 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&units=imperial&appid=3637031259467a0e65ab88aab5bc72ac';
    forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&appid=fa6783d745be2327802e22b3f198c7c9&units=imperial';
}

// This function modifies the HTML previously created with the current weather data,
// the data parameter accepts an array of data previously fetched from the weather API
function displayWeather(data) {
    const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    let desc = data.weather[0].description;
    weatherIcon.setAttribute('src',iconsrc);
    weatherIcon.setAttribute('alt',desc);
    weatherIcon.setAttribute('loading','lazy');
    weatherDesc.innerHTML=`${data.main.temp}&deg;F - ${desc}`;
    dateHTML.innerHTML = date.toLocaleDateString();
}

// This function removes the childs of the forecast HTML element, in order to clear
// the data there, to allow fresh data to be added.
function clearForecast() {
    while (forecastContainer.firstChild) {
        forecastContainer.removeChild(forecastContainer.firstChild);
    }
}

// This function adds HTML elements according to the weather forecast of the following 3 days,
// the data parameter accepts an array of data previously fetched from the forecast API
function displayWeatherForecast(data) {
    clearForecast();
    for (let i = 1; i < 4; i++) {
        let desc = data[i].weather[0].description;

        var futureDate = new Date(date);
        futureDate.setDate(date.getDate()+i);

        let container = document.createElement('div');
        container.classList.add("container2");

        let dateContainer = document.createElement('p');
        dateContainer.classList.add("dateContainer");
        dateContainer.innerHTML = futureDate.toLocaleDateString();

        let icon = document.createElement('img');
        let iconsrc= `https://openweathermap.org/img/wn/${data[i].weather[0].icon}.png`;
        icon.setAttribute('src',iconsrc);
        icon.setAttribute('alt',desc);
        icon.setAttribute('loading','lazy');

        let p = document.createElement('p');
        let description = document.createElement('span');
        description.innerHTML = `${data[i].main.temp}&deg;F - ${desc}`;

        p.appendChild(description);

        container.appendChild(dateContainer);
        container.appendChild(icon);
        container.appendChild(p);

        forecastContainer.appendChild(container);
    }
}