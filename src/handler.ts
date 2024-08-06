import { api } from "./api";
import { render } from "./render";
import { getElement } from "./utils";

export async function load(location: string, units?: "imperial" | "") {
  let weatherData;
  try {
    render.showLoading("loading");
    weatherData = await api.getWeatherData(location);
    if (localStorage.getItem("units") === "imperial") {
      render.renderApp(weatherData.data, "imperial");
    } else {
      render.renderApp(weatherData.data, units);
    }
    if (typeof weatherData.data.city === "string")
      localStorage.setItem("location", weatherData.data.city);
    render.showLoading("done");
    render.renderError(weatherData.code);
  } catch (error) {
    render.renderError(weatherData.code);
  }
}

const searchbar = getElement<HTMLInputElement>("#searchbar");
const btnSubmit = getElement<HTMLButtonElement>("#btnSubmit");

searchbar.addEventListener("keypress", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    submit(searchbar.value);
  }
});

btnSubmit.addEventListener("click", () => {
  submit(searchbar.value);
});

function submit(input: string) {
  if (input.trim() === "") return;
  load(input.trim(), "");
  searchbar.value = "";
}
