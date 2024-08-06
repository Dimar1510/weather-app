import { format } from "date-fns";
import { load } from "./handler";
import "./styles/current.scss";
import "./styles/forecast.scss";
import "./styles/details.scss";
import { getElement } from "./utils";

const render = (() => {
  let imp = false;
  const wrapper = getElement<HTMLElement>(".main");

  function renderError(status: string | number) {
    const errorText = getElement<HTMLElement>(".error");
    switch (status) {
      case 400:
        errorText.textContent = "Unable to find that location";
        break;

      default:
        errorText.textContent = "";

        break;
    }
    console.log("Response status:", status);
    showLoading("done");
  }

  function showLoading(state: "loading" | "done") {
    const loading = getElement<HTMLElement>(".loader");
    const card = getElement<HTMLElement>(".current-wrapper");
    const buttons = document.querySelectorAll("button");
    const searchbar = getElement<HTMLInputElement>("#searchbar");
    if (state === "loading") {
      loading.style.display = "block";
      buttons.forEach((button) => {
        button.disabled = true;
      });
      searchbar.disabled = true;
      searchbar.placeholder = "Awaiting response from service...";
      card.style.opacity = "0.5";
    } else {
      card.style.display = "flex";
      loading.style.display = "none";
      buttons.forEach((button) => {
        button.disabled = false;
      });
      searchbar.disabled = false;
      searchbar.placeholder = "Search location";
      card.style.opacity = "1";
    }
  }

  function renderApp(data: IWeather, units: "imperial" | "") {
    wrapper.classList.remove("error");
    imp = units === "imperial";
    setBackground(data);
    currentCard(data);
    detailsCard(data);
    showForecastDays(data);
    const btnForecastDays = getElement<HTMLElement>("#toggle-days");
    const btnForecastHours = getElement<HTMLElement>("#toggle-hours");
    btnForecastDays.classList.add("active");
    btnForecastHours.classList.remove("active");

    btnForecastDays.addEventListener("click", () => {
      showForecastDays(data);
      btnForecastDays.classList.add("active");
      btnForecastHours.classList.remove("active");
    });
    btnForecastHours.addEventListener("click", () => {
      showForecastHours(data);
      btnForecastDays.classList.remove("active");
      btnForecastHours.classList.add("active");
    });
  }

  function convertTime(time: string) {
    const newTime = time.split(":");
    if (newTime[1].endsWith("PM")) {
      newTime[0] = (parseInt(newTime[0]) + 12).toString();
    }
    return newTime.join(":").slice(0, 5);
  }

  function setBackground(data: IWeather) {
    const localTime = parseInt(format(data.time, "H:mm").split(":").join(""));
    const sunsetTime = parseInt(convertTime(data.sunset).split(":").join(""));
    const sunriseTime = parseInt(convertTime(data.sunrise).split(":").join(""));

    if (localTime < sunsetTime && localTime > sunriseTime) {
      document.body.classList.remove("night");
    } else {
      document.body.classList.add("night");
    }
  }

  function currentCard(data: IWeather) {
    const city = getElement<HTMLElement>("#city");
    const country = getElement<HTMLElement>("#country");
    const day = getElement<HTMLElement>(".current-day");
    const time = getElement<HTMLElement>(".current-time");
    const icon = getElement<HTMLElement>(".current-icon");
    const temp = getElement<HTMLElement>(".current-temp");
    const conditions = getElement<HTMLElement>(".conditions");
    const feelslike = getElement<HTMLElement>(".feelslike");
    const minTemp = getElement<HTMLElement>(".min");
    const maxTemp = getElement<HTMLElement>(".max");
    const sunrise = getElement<HTMLElement>("#sunrise");
    const sunset = getElement<HTMLElement>("#sunset");

    //location
    if (data.city !== undefined && data.country !== undefined) {
      city.textContent = `${data.city}, `;
      country.textContent = `${data.country}`;
    }

    day.textContent = imp
      ? format(data.time, "EEEE, LLL d yyyy")
      : format(data.time, "EEEE, d LLL yyyy");
    time.textContent = imp ? format(data.time, "p") : format(data.time, "H:mm");

    //main summary
    const condIcon = document.createElement("img");
    condIcon.src = data.conditionIcon;
    condIcon.alt = data.conditionText;
    icon.innerHTML = "";
    icon.append(condIcon);
    temp.textContent = imp
      ? `${data.currentTempF}°F`
      : `${data.currentTempC}°C`;

    //additional summary
    conditions.textContent = data.conditionText;
    feelslike.textContent = imp
      ? `Feels like ${data.feelslikeF}°F`
      : `Feels like ${data.feelslikeC}°C`;
    minTemp.textContent = imp ? `${data.minTempF}°F` : `${data.minTempC}°C`;
    maxTemp.textContent = imp ? `${data.maxTempF}°F` : `${data.maxTempC}°C`;

    //sun
    sunrise.textContent = imp
      ? `Sunrise: ${data.sunrise}`
      : `Sunrise: ${convertTime(data.sunrise)}`;
    sunset.textContent = imp
      ? `Sunset: ${data.sunset}`
      : `Sunset: ${convertTime(data.sunset)}`;
  }

  function detailsCard(data: IWeather) {
    const btnUnitToggle = getElement<HTMLButtonElement>(".toggle-unit");
    btnUnitToggle.classList.remove("F", "C");
    imp ? btnUnitToggle.classList.add("F") : btnUnitToggle.classList.add("C");
    btnUnitToggle.onclick = () => {
      if (imp) {
        localStorage.setItem("units", "");
        load(data.city, "");
      } else {
        localStorage.setItem("units", "imperial");
        load(data.city, "imperial");
      }
    };

    const humidity = getElement<HTMLElement>(".humidity");
    const precipitation = getElement<HTMLElement>(".precipitation");
    const windSpeed = getElement<HTMLElement>(".wind-speed");
    const cloudiness = getElement<HTMLElement>(".cloudiness");
    const uv = getElement<HTMLElement>(".uv-index");

    humidity.textContent = `${data.humidity}%`;
    precipitation.textContent = `${data.precipitation}%`;
    windSpeed.textContent = imp
      ? `${data.windSpeedMph} mph`
      : `${data.windSpeedKph} km/h`;
    cloudiness.textContent = `${data.cloudiness}%`;
    uv.textContent = data.uv.toString();
  }

  function showForecastDays(data: IWeather) {
    const list = getElement<HTMLElement>(".forecast-list");
    list.innerHTML = "";
    for (let i = 0; i < data.forecastDays.length; i++) {
      list.append(forecastDayCard(data, i));
    }
    list.classList.remove("hours");
  }

  function showForecastHours(data: IWeather) {
    const list = getElement<HTMLElement>(".forecast-list");
    list.innerHTML = "";
    for (let i = 0; i < data.forecastHours.length; i++) {
      list.append(forecastHourCard(data, i));
    }
    list.classList.add("hours");

    //horizontal scroll
    list.addEventListener(
      "wheel",
      (e: WheelEvent) => {
        e.preventDefault();
        if (e.deltaY > 0) list.scrollLeft += 20;
        else list.scrollLeft -= 20;
      },
      { passive: false }
    );
  }

  function createTooltip(text: string, item: HTMLElement) {
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.textContent = text;

    //position tooltip relative to pointer
    item.onmousemove = function (e) {
      const x = e.clientX;
      const y = e.clientY;
      tooltip.style.top = y + 20 + "px";
      tooltip.style.left = x + 20 + "px";
    };
    return tooltip;
  }

  function forecastDayCard(data: IWeather, index: number) {
    const day = data.forecastDays[index];
    const item = document.createElement("li");
    item.classList.add("forecast-item");
    const date = document.createElement("div");
    date.classList.add("item-day");
    const icon = document.createElement("img");

    const minmax = document.createElement("div");
    minmax.classList.add("item-minmax");

    date.textContent = format(day.date, "eeee");
    icon.src = day.conditionIcon;
    icon.alt = day.conditionText;

    minmax.textContent = imp
      ? `${day.minTempF}°F / ${day.maxTempF}°F`
      : `${day.minTempC}°C / ${day.maxTempC}°C`;

    item.append(date, icon, minmax, createTooltip(day.conditionText, item));
    return item;
  }

  function forecastHourCard(data: IWeather, index: number) {
    const hour = data.forecastHours[index];
    const item = document.createElement("li");
    item.classList.add("forecast-item");
    const date = document.createElement("div");
    date.classList.add("item-hour");
    const icon = document.createElement("img");

    const temp = document.createElement("div");
    temp.classList.add("item-temp");

    date.textContent = format(hour.time, "H:mm");
    icon.src = hour.conditionIcon;
    icon.alt = hour.conditionText;
    temp.textContent = imp ? `${hour.tempF}°F` : `${hour.tempC}°C`;

    item.append(date, icon, temp, createTooltip(hour.conditionText, item));

    return item;
  }

  return { renderApp, renderError, showLoading };
})();

export { render };
