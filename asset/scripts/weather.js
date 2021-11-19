const API_KEY = 'df95cc678bc3edee224768c8fe9a8459';
const URL = 'api.openweathermap.org/data/2.5';


function getCurrenWeather(cityId) {
    return fetch(`https://${URL}/weather?id=${cityId}&appid=${API_KEY}&units=metric`)
        .then(async response => await response.json())
        .catch(error => error)
}