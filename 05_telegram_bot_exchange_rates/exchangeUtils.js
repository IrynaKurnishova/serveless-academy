const axios = require("axios");
const apiUrlMono = 'https://api.monobank.ua/bank/currency';
const apiUrlPrivate = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5'
const NodeCache = require( "node-cache" );
const cache = new NodeCache({ stdTTL: 60, checkperiod: 70, deleteOnExpire: true });

async function filteredMonoRates() {
    const cachedData = cache.get("filteredMonoData")
    if (cachedData) {
        return cachedData
    } else {
        try {
            const response = await axios.get(apiUrlMono);
            const filteredMonoData = response.data.filter(currency => {
                return (currency.currencyCodeA === 840 && currency.currencyCodeB === 980) ||
                    (currency.currencyCodeA === 978 && currency.currencyCodeB === 980);
            });
            cache.set("filteredMonoData", filteredMonoData)
            return filteredMonoData;

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}

async function getMonoRates(currencyCode, currencyName) {
    try {
        const dataMono = await filteredMonoRates();
        const currencyCodeA = currencyCode;
        if (currencyCodeA) {
            const filteredData = dataMono.filter(currency => currency.currencyCodeA === currencyCodeA);
            const result = filteredData.map(currency => ({
                rateBuy: currency.rateBuy,
                rateSell: currency.rateSell,
            }));
            const formattedResult = result.map(currency => `Mono: ${currencyName.toUpperCase()}\nBuy: ${currency.rateBuy}\nSell: ${currency.rateSell}`).join(',');
            return formattedResult;
        } else {
            return 'Unknown currency: ' + currencyName;
        }
    } catch (error) {
        return 'Error: ' + error.message;
    }
}

async function filteredPrivateRates(currencyName) {

    const {data} = await axios.get(apiUrlPrivate);
    if (currencyName) {
        const filteredData = data.filter(currency =>currency.ccy === currencyName.toUpperCase());
        const result = filteredData.map(currency => ({
            rateBuy: currency.buy,
            rateSell: currency.sale,
        }));
        const formattedResult = result.map(currency => `Private: ${currencyName.toUpperCase()}\nBuy: ${currency.rateBuy}\nSell: ${currency.rateSell}`).join(',');
        return formattedResult
    } else {
        return 'Unknown currency: ' + currencyName;
    }
}

module.exports = { getMonoRates, filteredPrivateRates };
