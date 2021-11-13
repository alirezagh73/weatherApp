const dataSuggestion = document.getElementById("suggestion-wrapper");


const debounce = _.debounce(searchCities, 500);

function handleRequests() {
    debounce(event);
}

async function searchCities(event) {
    // localStorage.clear();
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


function citySelect(city) {
    console.log("city selected: ", city);
    const inputSearch = document.getElementById("search_inp");
    inputSearch.value = city.name;
}


function setRecentCities(cities) {

    let recentData = cities.slice(0, 4)
    recentData = JSON.stringify(recentData);
    localStorage.setItem("RECENT_SEARCH", recentData);
}