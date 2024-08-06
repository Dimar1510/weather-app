interface IWeather {
  city: string;
  country: string;
  time: string;
  conditionText: string;
  conditionIcon: string;
  currentTempC: number;
  currentTempF: number;
  feelslikeC: number;
  feelslikeF: number;
  minTempC: number;
  minTempF: number;
  maxTempC: number;
  maxTempF: number;
  sunrise: string;
  sunset: string;
  isSunUp: 0 | 1;
  humidity: number;
  precipitation: number;
  windSpeedMph: number;
  windSpeedKph: number;
  cloudiness: number;
  uv: number;
  forecastDays: IDay[];
  forecastHours: IHour[];
}

interface IDay {
  date: string;
  conditionIcon: string;
  conditionText: string;
  minTempC: number;
  minTempF: number;
  maxTempC: number;
  maxTempF: number;
}

interface IHour {
  time: string;
  conditionIcon: string;
  conditionText: string;
  tempC: number;
  tempF: number;
}
