const axios = require("axios");
const cityName = process.env.CITY;
const mapboxAPIKEY = process.env.API_KEY;
const now = new Date();
const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

async function getWeatherForecast () {
    try {
        const weatherForecast = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${mapboxAPIKEY}`
        )
        return weatherForecast.data
    } catch (error) {
        return { error: "An error occurred while creating the report" }
    }
}

async function filteredForecast(interval) {
    const forecast = await getWeatherForecast();

    if (!forecast) {
        return "Failed to retrieve weather data.";
    }

    let mainMessage;

    if (interval === "wind") {
        const filteredDataWind = forecast.list.map(item => ({
            speed: item.wind.speed,
            deg: item.wind.deg,
            gust: item.wind.gust
        }));
        const firstItem = filteredDataWind[0];

        mainMessage = `Wind Speed: ${firstItem.speed} m/s\nWind Direction: ${firstItem.deg}°\nWind Gust: ${firstItem.gust} m/s\n\n`;

    }
    else {
        const next24HoursData = forecast.list.filter(item => {
            const itemDate = new Date(item.dt_txt);
            return itemDate >= now && itemDate <= twentyFourHoursLater;
        });

        const filteredTimeAndTemp = next24HoursData.map(item => ({
            time: item.dt_txt.replace(":00", ""),
            temperature: Math.round(item.main.temp - 273.15),
            precipitation: item.weather[0]?.description,
        }));

        const filteredData = interval === 6 ?
            filteredTimeAndTemp.filter((_, index) => index % 2 === 0) : filteredTimeAndTemp;

        mainMessage = filteredData.map(data => {
            return `Time: ${data.time.split(" ")[1]}\nTemperature: ${data.temperature}\nPrecipitation: ${data.precipitation}\n\n`;
        }).join('\n');
    }

    return responseToUser(mainMessage);
}


const responseToUser = (mainMessage) => {
    return `Weather in Kharkiv \n\n${mainMessage}`
}

module.exports = {filteredForecast}
