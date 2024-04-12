import { format } from "date-fns";
import { load } from "./handler";

const render = function() {
    let imp = false;
    const wrapper = document.querySelector('.main')
    const card = document.querySelector('.current-wrapper')

    function renderError() {
        wrapper.classList.add('error')
       
    }
    
    function renderApp(data, units) {
        wrapper.classList.remove('error')
        imp = units === 'imperial'
        currentCard(data)
        detailsCard(data)
        showForecastDays(data)
        const btnForecastDays = document.querySelector('#toggle-days')
        const btnForecastHours = document.querySelector('#toggle-hours')
        btnForecastDays.classList.add('active')
        btnForecastHours.classList.remove('active')

        btnForecastDays.addEventListener('click', () => {
            showForecastDays(data)
            btnForecastDays.classList.add('active')
            btnForecastHours.classList.remove('active')
        })
        btnForecastHours.addEventListener('click', () => {
            showForecastHours(data)
            btnForecastDays.classList.remove('active')
            btnForecastHours.classList.add('active')
        })

    }

 

    function currentCard(data) {
        const adress = document.querySelector('.adress')
        const day = document.querySelector('.current-day')
        const time = document.querySelector('.current-time')
        const icon = document.querySelector('.current-icon')
        const temp = document.querySelector('.current-temp')
        const conditions = document.querySelector('.conditions')
        const feelslike = document.querySelector('.feelslike')
        const minTemp = document.querySelector('.min')
        const maxTemp = document.querySelector('.max')
        const sunrise = document.querySelector('#sunrise')
        const sunset = document.querySelector('#sunset')

        const loading = document.querySelector('.loader')
        

        loading.style.display = 'none'
        card.style.display = 'flex'
        
        //location
        adress.textContent = `${data.city}, ${data.country}`
        imp? day.textContent = format(data.time, "EEEE, LLL d yyyy") :
        day.textContent = format(data.time, "EEEE, d LLL yyyy")
        imp? time.textContent = format(data.time, "p"):
        time.textContent = format(data.time, "H:mm")

        //main summary
        const condIcon = document.createElement('img')
        condIcon.src = data.conditionIcon
        condIcon.alt = data.conditionText
        icon.innerHTML = ''
        icon.append(condIcon)
        temp.textContent = imp? `${data.currentTempF}°F` : `${data.currentTempC}°C`

        //additional summary
        conditions.textContent = data.conditionText
        feelslike.textContent = imp? `Feels like ${data.feelslikeF}°F` : `Feels like ${data.feelslikeC}°C`
        minTemp.textContent = imp? `${data.minTempF}°F` : `${data.minTempC}°C`
        maxTemp.textContent = imp? `${data.maxTempF}°F` : `${data.maxTempC}°C`

        //sun
        sunrise.textContent = imp? 
        `Sunrise: ${data.sunrise}`:
        `Sunrise: ${convertTime(data.sunrise)}`
        sunset.textContent = imp? 
        `Sunset: ${data.sunset}`:
        `Sunset: ${convertTime(data.sunset)}`
        
        function convertTime(time) {
            let newTime = time.split(':')
            if (newTime[1].endsWith('PM')) newTime[0] = parseInt(newTime[0])+12
            newTime = newTime.join(':').slice(0,5)
            return newTime
        }

        //set day/night background
        const localTime = parseInt(format(data.time, "H:mm").split(':').join(''))
        const sunsetTime = parseInt(convertTime(data.sunset).split(':').join(''))
        const sunriseTime = parseInt(convertTime(data.sunrise).split(':').join(''))

        if (localTime < sunsetTime && localTime > sunriseTime) {
            document.body.classList.remove('night')
        } else {
            document.body.classList.add('night')
        }

    }

    function detailsCard(data) {
        const btnUnitToggle = document.querySelector(".toggle-unit")
        btnUnitToggle.classList.remove('F', 'C')
        imp? btnUnitToggle.classList.add('F') : btnUnitToggle.classList.add('C')
        btnUnitToggle.onclick = () => {
            imp ? load(data.city, '') : load(data.city, 'imperial')
        }
        
        const humidity = document.querySelector(".humidity")
        const precipitation = document.querySelector(".precipitation")
        const windSpeed = document.querySelector(".wind-speed")
        const cloudiness = document.querySelector(".cloudiness")
        const uv = document.querySelector(".uv-index")

        humidity.textContent = `${data.humidity}%`
        precipitation.textContent = `${data.precipitation}%`
        windSpeed.textContent = imp? `${data.windSpeedMph} mph` : `${data.windSpeedKph} km/h`
        cloudiness.textContent = `${data.cloudiness}%`
        uv.textContent = data.uv
    }

    function showForecastDays(data) {
        const list = document.querySelector('.forecast-list')
        list.innerHTML = ''
        for (let i = 0; i < data.forecastDays.length; i++) {
            list.append(forecastDayCard(data, i))
        }
        list.classList.remove('hours')    
    }

    function showForecastHours(data) {
        const list = document.querySelector('.forecast-list')
        list.innerHTML = ''
        for (let i = 0; i < data.forecastHours.length; i++) {
            list.append(forecastHourCard(data, i))
        } 
        list.classList.add('hours')   
        
        list.addEventListener("wheel", (e) => {
            e.preventDefault();
            if (e.deltaY > 0) list.scrollLeft += 20;
            else list.scrollLeft -= 20;
        });
    }
 
 
    function forecastDayCard(data, element) {
        const day = data.forecastDays[element]
        const item = document.createElement('li')
        item.classList.add('forecast-item')
        const date = document.createElement('div')
        date.classList.add('item-day')
        const icon = document.createElement('img')

        const minmax = document.createElement('div')
        minmax.classList.add('item-minmax')

        date.textContent = format(day.date, 'eeee')
        icon.src = day.conditionIcon
        icon.alt = day.conditionText

        minmax.textContent = imp? 
        `${day.minTempF}°F / ${day.maxTempF}°F` :
        `${day.minTempC}°C / ${day.maxTempC}°C`

        item.append(date, icon, minmax)
        return item
    }

    function forecastHourCard(data, element) {
        const hour = data.forecastHours[element]
        const item = document.createElement('li')
        item.classList.add('forecast-item')
        const date = document.createElement('div')
        date.classList.add('item-hour')
        const icon = document.createElement('img')
    
        const temp = document.createElement('div')
        temp.classList.add('item-temp')

        date.textContent = format(hour.time,'H:mm')
        icon.src = hour.conditionIcon
        icon.alt = hour.conditionText
        temp.textContent = imp? 
        `${hour.tempF}°F` : `${hour.tempC}°C`

        item.append(date, icon, temp)

        return item
    }



    return {renderApp, renderError}
}()

export { render }
