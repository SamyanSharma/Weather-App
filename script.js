const city = document.querySelector("#city");
const searchBtn = document.querySelector("#searchBtn");
const output = document.querySelector("#output");
const suggestions = document.querySelector("#suggestions");

const api = "YOUR_API_KEY";

city.addEventListener("input", () => {
    if (city.value.length < 2) {
        suggestions.innerHTML = '';
        return;
    }
    searchCities(city.value);
});

searchBtn.addEventListener("click", () => {
    if(city.value.trim() !== "") {
        getWeather(city.value);
        suggestions.innerHTML = '';
    }
});

function getWeather(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api}&units=metric`;

    output.innerHTML = "<p>Loading...</p>";

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then((response) => {
            const temp = response.main.temp;
            const feelsLike = response.main.feels_like;
            const description = response.weather[0].description;
            const iconCode = response.weather[0].icon;
            const humidity = response.main.humidity;
            const windSpeed = response.wind.speed;
            const name = response.name;
            const country = response.sys.country;

            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

            output.innerHTML = `
                <h2>${name}, ${country}</h2>
                <img src="${iconUrl}" alt="${description}">
                <h3>${temp}°C</h3>
                <div class="weather-details">
                    <p style="text-transform: capitalize;"><strong>${description}</strong></p>
                    <p>Feels like: <strong>${feelsLike}°C</strong></p>
                    <p>Humidity: <strong>${humidity}%</strong></p>
                    <p>Wind Speed: <strong>${windSpeed} m/s</strong></p>
                </div>
            `;
        })
        .catch((error) => {
            output.innerHTML = `<p class="error">${error.message}. Please try again.</p>`;
        });
}

function searchCities(query) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${api}`;

    fetch(url)
        .then((response) => response.json())
        .then((response) => {
            suggestions.innerHTML = '';
            console.log(response);
            response.forEach((item) => {
                const div = document.createElement("div");
                
                const state = item.state ? `, ${item.state}` : '';
                div.innerHTML = `${item.name}${state}, ${item.country}`;
                
                div.addEventListener("click", () => {
                    city.value = item.name;
                    suggestions.innerHTML = ''; 
                    getWeather(item.name);
                });

                suggestions.append(div);
            });
        });
}

document.addEventListener("click", (e) => {
    if (e.target.id !== "city") {
        suggestions.innerHTML = '';
    }
});