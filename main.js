// -------------------- FETCH WEATHER --------------------
async function getWeather(lat, lon) {
  const loader = document.getElementById('loader');
  const forecastContainer = document.getElementById('forecast-container');

  // Show loader, hide forecast
  loader.style.display = 'block';
  forecastContainer.style.display = 'none';

  const url = `http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civillight&output=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const forecastData = data.dataseries.slice(0, 7);
    updateForecast(forecastData);

    // Once data is fetched and UI is ready
    forecastContainer.style.display = 'flex'; // or block depending on your layout
  } catch (error) {
    console.error("Error fetching weather:", error);
  } finally {
    loader.style.display = 'none'; // hide loader in both success/error cases
  }

  console.log(`Fetched weather for: ${lat}, ${lon}`);
}

//------EVERYTHING TO DISAPEAR ON LOAD---------//
window.onload = function () {
  document.getElementById("forecast-container").style.display = "none";
};


// -------------------- POPULATE CITY DROPDOWN --------------------
fetch('./city_coordinates.csv')
  .then(res => res.text())
  .then(data => {
    const lines = data.trim().split('\n');
    const cities = lines.map(line => {
      const [lon, lat, city, country] = line.split(',');
      return { lon, lat, city, country };
    });
    populateDropdown(cities);
  });

function populateDropdown(cities) {
  const select = document.getElementById('citySelect');
  cities.forEach(({ lon, lat, city, country }) => {
    const option = document.createElement('option');
    option.value = `${lon},${lat}`;
    option.textContent = `${city}, ${country}`;
    select.appendChild(option);
  });
}

// -------------------- HANDLE SELECTION --------------------
document.getElementById("citySelect").addEventListener("change", function () {
  const [lon, lat] = this.value.split(',');
  document.getElementById("forecast-container").innerHTML = ""; // clear old forecast

  getWeather(lon, lat);
});
//---MESSAGE POPUP SECTION---
const citySelect = document.getElementById("citySelect");
const hoverMessage = document.getElementById("hoverMessage");

citySelect.addEventListener("mouseover", () => {
  hoverMessage.style.display = "block";
});

citySelect.addEventListener("mouseout", () => {
  hoverMessage.style.display = "none";
});

    

// -------------------- CSS STYLES --------------------
const style = document.createElement('style');
style.textContent = `
  body { 
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;  
    padding: 20px;
  }
    #forecast-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-top: 20px;
  }
    .forecast-day {
    background-color:rgba(254, 251, 251, 0.24);
    border: 1px solid rgba(49, 48, 48, 0.1);
    border-radius: 8px;
    padding: 10px;
    width: 150px;
    text-align: center;
    margin: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
    #forecast0, #forecast1, #forecast2, #forecast3, #forecast4, #forecast5, #forecast6 {
  border: 1px solid gray;
  display: block;
  background-color: rgba(244, 239, 239, 0.285);
  border-radius: 6px;
  text-align: center;
  margin: 40px;
  padding: 5px;
  width: 2in;
  font-size: 20px;
  box-shadow: 0 3px 10px gray;
 }

`;
document.head.appendChild(style);
// -------------------- ICON MAP --------------------
const conditionMap = {
  CLEAR: "clear.png",
  PCLOUDY: "partlycloudy.png",
  MCLOUDY: "mcloudy1.png",
  CLOUDY: "cloudy.png",
  HUMID: "humid.png",
  RAIN: "rain.png",
  SNOW: "snow1.png",
  ISHOWER: "ishowers.png",
  LIGHTRAIN: "lightrain.png",
  LIGHTSNOW: "lightsnow.png",
  THUNDERSTORM: "ts.png",
  WINDY: "windy.png",
  FOG: "foggy.png",
  RAINSNOW: "rainsnow.png",
  OSHOWER: "oshowers.png",
  STORMPOSSIBLE: "stormpossible.png",
};

// -------------------- UPDATE FORECAST DISPLAY --------------------
function updateForecast(forecastData) {
  const container = document.getElementById("forecast-container");
  container.innerHTML = ""; // clear old content

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  forecastData.forEach((day, index) => {
    const dateObj = new Date();
    dateObj.setDate(today.getDate() + index);
    const dayName = daysOfWeek[dateObj.getDay()];
    const date = `${dayName}, ${dateObj.getDate()} ${dateObj.toLocaleString("default", { month: "short" })}`;

    const condition = day.weather?.toUpperCase() || "default";
    const icon = conditionMap[condition] || "default.png";
    const high = day.temp2m?.max??"--";
    const low = day.temp2m?.min ??"--";

    const forecastEl = document.createElement("div");
    forecastEl.classList.add("forecast-day");
    forecastEl.innerHTML = `
      <h3>${date}</h3>
      <img src="js/${icon}" alt="${condition}" class="weather-icon"><br/>
      <p class="condition">${condition}</p>
      <p class="temp">H:${high}°C<br/>L:${low}°C</p>
    `;
    container.appendChild(forecastEl);
  });
}
