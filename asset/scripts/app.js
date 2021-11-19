const dataSuggestion = document.getElementById("suggestion-wrapper");
const directions = {
    1: "N",

    2: "NNE",

    3: "NE",

    4: "ENE",

    5: "E",

    6: "ESE",

    7: "SE",

    8: "SSE",

    9: "S",

    10: "SSW",

    11: "SW",

    12: "WSW",

    13: "W",

    14: "WNW",

    15: "NW",

    16: "NNW",

    17: "N",
}

const debounce = _.debounce(searchCities, 500);

function handleRequests() {
    debounce(event);
}

async function searchCities(event) {
    dataSuggestion.innerHTML = '';
    if (event.target.value) {
        let cities = await getCities(event.target.value);
        // console.log(cities)
        toggleSuggestion(event.target.value);
        if (cities.length) {
            // console.log(cities)
            showSuggestion(cities);
            setRecentCities(cities);

        } else {
            dataSuggestion.innerHTML = `<span>The <strong>${event.target.value}</strong> is not Found </span><span>Try another City</span>`;
        }
    }
}


// for showing recent search
function focusInput() {
    let recentCities = JSON.parse(localStorage.getItem("RECENT_SEARCH"));

    if (recentCities && recentCities.length) {

        showSuggestion(recentCities);
        toggleSuggestion(true);
    }

}

function unFocusInput() {
    setTimeout(() => toggleSuggestion(false), 220)
}

function toggleSuggestion(isShow) {
    isShow ?
        dataSuggestion.classList.add('search_suggestion-wrapper-active') : dataSuggestion.classList.remove('search_suggestion-wrapper-active');

    !isShow && (() => dataSuggestion.innerHTML = '')();
}


function showSuggestion(data) {
    let ul = document.createElement("ul");
    ul.classList.add("search_suggestion-wrapper_items");
    data.forEach((city) => {
        const element = document.createElement("li");
        element.classList.add("search_suggestion-wrapper_item");
        element.onclick = () => citySelect(city)
        element.innerText = city.name;
        ul.appendChild(element)
    })

    dataSuggestion.appendChild(ul);

}


async function citySelect(city) {
    const inputSearch = document.getElementById("search_inp");
    inputSearch.value = city.name;
    let response = await getCurrenWeather(city.id);
    let newResponse = await getFiveDaysWeather(city.id);
    console.log(newResponse)
    console.log(response);
    changeCurrentWeatherDetails(response);
    createFiveDaysWeatherCards(newResponse)
}


function setRecentCities(cities) {
    let recentData = cities.slice(0, 4)
    recentData = JSON.stringify(recentData);
    localStorage.setItem("RECENT_SEARCH", recentData);
}

function changeCurrentWeatherDetails(info) {
    const cityName = document.querySelector(".city_name");
    const cityTemp = document.querySelector(".details_temp");
    const weatherImg = document.querySelector(`.weather-img`);
    const cityDay = document.querySelector(".details_table_day");
    const cityHumidity = document.querySelector(".city_humidity");
    const windDirection = document.querySelector(".direction");
    const cityPressure = document.querySelector(".city_pressure");
    weatherImg.src = `http://openweathermap.org/img/wn/${info.weather[0].icon}@4x.png`
    cityName.innerHTML = `${info.name}, ${info.sys.country}`;
    cityTemp.innerHTML = `${info.main.temp}&deg;C`;
    cityDay.innerHTML = moment().format('dddd');
    cityHumidity.innerHTML = `${info.main.humidity}%`;
    const windDir = Math.round(`${(info.wind.deg / 22 / 5) + 1}`);
    windDirection.innerHTML = `${directions[windDir]},${info.wind.speed} m/s`
    cityPressure.innerHTML = `${info.main.pressure} hPa`;
}

function createFiveDaysWeatherCards(info) {
    const cardsWrapper = document.getElementById("cards-wrapper");
    let FiveDayInfo = info.list.filter((item, index) => index % 8 === 0);
    console.log(FiveDayInfo);
    let template = '';
    FiveDayInfo.forEach((item, index) => {

        template += ` <li class="cards_item margin-b-35 padding-vertical-15">
                           <figure class="cards_item_sun">
                              <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png" alt="">
                           </figure>
                           <div class="cards_item_day margin-b-15">
                                 <span>${moment(item.dt * 1000).format('dddd')}</span>
                           </div>
                           <div class="cards_item_temp margin-b-15">
                                 <span>${item.main.temp} &deg;C</span>
                           </div>
                      </li>`

    })
    cardsWrapper.innerHTML = template;
}

