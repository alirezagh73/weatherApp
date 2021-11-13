const city = 'asset/City.list/city.list.json';


 function getCities(cityNames) {
    return fetch(city)
        .then(response => response.json())
        .then(data => {
            return data.filter(item => item.name.toLowerCase().includes(cityNames.toLowerCase()));

        })
}

