const axios = require("axios");
const mapboxAPIKEY = process.env.API_KEY;
const cityName = process.env.CITY;

const now = new Date();
const stringDate = `${now}\n`;
const messageDate = stringDate.replace("GMT+0200", "")
const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

const responseToUser = (mainMessage) => {
    return `<b>Weather in Kharkiv for the next 24 hours</b>\n\n${messageDate}\n${mainMessage}`
}

const getSearchResults = async () => {
    try {
        const result = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${mapboxAPIKEY}`
        );

        if (result.data.list) {
            const next24HoursData = result.data.list.filter(item => {
                const itemDate = new Date(item.dt_txt);
                return itemDate >= now && itemDate <= twentyFourHoursLater;
            });

            const filteredTimeAndTemp = next24HoursData.map(item => ({
                time: item.dt_txt.replace(":00", ""),
                temperature: Math.round(item.main.temp - 273.15),
                precipitation: item.weather[0]?.description,
            }));

            return filteredTimeAndTemp;
        } else {
            return [];
        }
    } catch (error) {
        return { error: "An error occurred while creating the report" }
    }
};

module.exports = {responseToUser, getSearchResults}
