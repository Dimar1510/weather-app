import { api } from "./api";
import { render } from "./render";

export async function load(location, units) {
    try {
        const weatherData = await api.getWeatherData(location)
        render.renderApp(weatherData, units)   
    } catch (error) {
        render.renderError()
    }

}

const searchbar = document.querySelector('#searchbar')
const btnSubmit = document.querySelector('#btnSubmit')

searchbar.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        submit(searchbar.value)
    }
})

btnSubmit.addEventListener('click', () => {
    submit(searchbar.value)
})

function submit(input) {
    if (input.trim() === '' ) return
    load(input.trim(), '')
    searchbar.value = ''
}
