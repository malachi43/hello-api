require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const { AxiosError } = require("axios");
const PORT = process.env.PORT || 3000;
const baseUrl = `/api`
const weatherApiBaseUrl = `http://api.weatherapi.com/v1`

app.get(`${baseUrl}/hello`, async (req, res) => {
    try {
        const visitorName = req.query?.visitor_name;
        const key = process.env.WEATHER_API_KEY
        const { data } = await axios.get(`${weatherApiBaseUrl}/current.json`, {
            params: {
                key,
                q: req.headers["x-forwarded-for"]
            }
        })
        const { location: { name } } = data;
        const { current: { temp_c } } = data;

        res.status(200).json({
            client_ip: req.ip,
            location: name,
            greeting: `Hello, ${visitorName ? visitorName : "user"}!,the temperature is ${temp_c} degrees Celcius in ${name}`
        })
    } catch (error) {
        if (error instanceof AxiosError) {
            return res.status(400).json({
                status: false,
                error_msg: error.response.data,
            })
        }
        res.status(400).json({
            status: false,
            error_msg: error.message,
        })
    }

})


app.listen(PORT, () => {
    console.log(`server is listening on port: ${PORT}. Press Ctrl+C to terminate.`)
})