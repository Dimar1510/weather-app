const api = function() {
    const KEY = '473492deee684591b2a65102241104';
    async function getWeatherData(location) {
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${KEY}&q=${location}&days=3&aqi=no&alerts=no`, {mode:'cors', signal: AbortSignal.timeout(6000)});
            const result = await response.json();
            const data = processedData(result)
            
            return data
        } catch (error) {
            console.log('api error')
        }
    }


    function processedData(data) {
        const currentWeatherData = {
            city: data.location.name,
            country: data.location.country,
            time: data.location.localtime,
            conditionText: data.current.condition.text,
            conditionIcon: data.current.condition.icon,
            currentTempC: Math.round(data.current.temp_c),
            currentTempF: Math.round(data.current.temp_f),
            feelslikeC: Math.round(data.current.feelslike_c),
            feelslikeF: Math.round(data.current.feelslike_f),
            minTempC: Math.round(data.forecast.forecastday[0].day.mintemp_c),
            minTempF: Math.round(data.forecast.forecastday[0].day.mintemp_f),
            maxTempC: Math.round(data.forecast.forecastday[0].day.maxtemp_c),
            maxTempF: Math.round(data.forecast.forecastday[0].day.maxtemp_f),
            sunrise: data.forecast.forecastday[0].astro.sunrise,
            sunset: data.forecast.forecastday[0].astro.sunset,
            isSunUp: data.forecast.forecastday[0].astro.is_sun_up,
            humidity: data.current.humidity,
            precipitation: Math.max(
                data.forecast.forecastday[0].day.daily_chance_of_rain, 
                data.forecast.forecastday[0].day.daily_chance_of_snow
                ),
            windSpeedMph: data.current.gust_mph,
            windSpeedKph: data.current.gust_kph,
            cloudiness: data.current.cloud,
            uv: data.current.uv,
            forecastDays: [],
            forecastHours: []
        }

        for (let i = 0; i < data.forecast.forecastday.length; i++) {
            const day = {
                date: data.forecast.forecastday[i].date,
                conditionIcon: data.forecast.forecastday[i].day.condition.icon,
                conditionText: data.forecast.forecastday[i].day.condition.text,
                minTempC: Math.round(data.forecast.forecastday[i].day.mintemp_c),
                minTempF: Math.round(data.forecast.forecastday[i].day.mintemp_f),
                maxTempC: Math.round(data.forecast.forecastday[i].day.maxtemp_c),
                maxTempF: Math.round(data.forecast.forecastday[i].day.maxtemp_f)
            }
            currentWeatherData.forecastDays.push(day)
        }

        for (let i = 0; i < data.forecast.forecastday[1].hour.length; i++) {
            const hour = {
                time: data.forecast.forecastday[1].hour[i].time,
                conditionIcon: data.forecast.forecastday[1].hour[i].condition.icon,
                conditionText: data.forecast.forecastday[1].hour[i].condition.text,
                tempC: Math.round(data.forecast.forecastday[1].hour[i].temp_c),
                tempF: Math.round(data.forecast.forecastday[1].hour[i].temp_f),
            }
            currentWeatherData.forecastHours.push(hour)
        }

        return currentWeatherData
    }

    return {getWeatherData}
}()

export {api}



