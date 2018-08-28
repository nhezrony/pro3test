// const fs = require("fs")
const axios = require("axios");
// const JSON = require('circular-json');
const plotly = require("plotly")("rutgers-project3", "eBC5dw2ZOkgt88rxj1j9");

const getUrl = async symbol => {
    try {
        // let apiKeys = ['CXTKXO6Z1L2X0NDW', 'VM4UOP93S2OVK7R1', '0KFW65D8QGSUQF3Q', 'JOVIVD775BALW2U6', 'RGJ09VBG2Q8HSFZX', '5VRVCG7QLZPEAXOK']
        // const resp = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${apiKeys[Math.floor(Math.random() * 5)]}&outputsize=full`)
        const resp = await axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=CXTKXO6Z1L2X0NDW&outputsize=full`
        );
        return resp.data;
    } catch (err) {
        console.log(err);
    }
    const callOverload =
        '{\n    "Information": "Thank you for using Alpha Vantage! Please visit https://www.alphavantage.co/premium/ if you would like to have a higher API call volume."\n}';
    const invalidCompany =
        '{\n    "Error Message": "Invalid API call. Please retry or visit the documentation (https://www.alphavantage.co/documentation/) for TIME_SERIES_DAILY_ADJUSTED."\n}';

    if (resp == callOverload) {
        return "please try again in 1 minute sorry for any inconvenience";
    } else if (resp == invalidCompany) {
        return "sorry but the company you entered is invalid";
    }
};

const cleanData = res => {
    return new Promise((resolve, reject) => {
        let dates = Object.keys(res["Time Series (Daily)"]);
        const values = dates.map(date => {
            const {
                "1. open": open,
                "2. high": high,
                "3. low": low,
                "4. close": close,
                "5. adjusted close": adjustedClose,
                "6. volume": volume
            } = res["Time Series (Daily)"][date];
            const graphText = `open: ${open}<br>high: ${high}<br>low: ${low}<br>close: ${close}<br>adjusted close: ${adjustedClose}<br>volume: ${volume}<br>`;
            return {
                date,
                open,
                high,
                low,
                close,
                adjustedClose,
                volume,
                graphText
            };
        });
        resolve(values);
    });
};

const plot = (compData, graphName) => {
    return new Promise((resolve, reject) => {
        const dates = compData.map(values => values.date);
        const graphText = compData.map(values => values.graphText);
        const adjustedClose = compData.map(values => values.adjustedClose);
        let title = ''
        let color = ''
        switch (graphName) {
            case 'Min Graph':
                title = 'Companies worst week'
                color = "#ff0000"
                break;
            case 'Max Graph':
                title = 'Companies best week'
                color = "#00ff00"
                break;
            default:
                title = 'Companies historic values'
                color = "#0040ff"
        }
        let data = [{
            x: dates,
            y: adjustedClose,
            type: "scatter",
            hovertext: graphText,
            hoverinfo: "text",
            line: {
                color: color,
                width: 2
            },
        }];
        var layout = {
            title: title,
        }
        let graphOptions = {
            filename: graphName,
            fileopt: "overwrite",
            layout: layout
        };
        plotly.plot(data, graphOptions, (err, msg) => {
            // resolve(msg.url)
            //   resolve(msg);
            resolve(
                `${msg.url}.embed">`.replace("https:", "")
            );
        });
    });
};

const historicalData = data => {
    return new Promise((resolve, reject) => {
        const adjustedClose = data.map(values => values.adjustedClose);
        const min = adjustedClose.indexOf(`${Math.min(...adjustedClose)}00`);
        const minData = data.filter(
            (values, index) => index > min - 4 && index < min + 4
        );
        const max = adjustedClose.indexOf(`${Math.max(...adjustedClose)}00`);
        const maxData = data.filter(
            (values, index) => index > max - 4 && index < max + 4
        );
        resolve({
            minData: minData,
            maxData: maxData
        });
    });
};

const start = async symbol => {
    let resp = await getUrl(symbol);
    const data = await cleanData(resp);
    const minMaxData = await historicalData(data);
    let mainGraphUrl = await plot(data, `Main Graph`);
    let maxGraphUrl = await plot(minMaxData.maxData, `Min Graph`);
    let minGraphUrl = await plot(minMaxData.minData, `Max Graph`);
    mainGraphUrl = `<iframe id="mainGraphUrl" width="800" height="500" frameborder="0" scrolling="no" src="${mainGraphUrl}"></iframe>`
    maxGraphUrl = `<iframe id="mainGraphUrl" width="400" height="250" frameborder="0" scrolling="no" src="${maxGraphUrl}"></iframe>`
    minGraphUrl = `<iframe id="mainGraphUrl" width="400" height="250" frameborder="0" scrolling="no" src="${minGraphUrl}"></iframe>`
    return {
        mainGraphUrl,
        minGraphUrl,
        maxGraphUrl
    };
};

const links = async symbol => {
    console.log("waiting for data");
    return graphLinks = await start(symbol);
};

module.exports = {
    links
};