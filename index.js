const http = require('http');
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempval,orgval) => {
    let temperature = tempval.replace("{%tempval%}", orgval.current.temp_c);
    temperature = temperature.replace("{%location%}", orgval.location.name);
    temperature = temperature.replace("{%country%}", orgval.location.country);
    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests(
            "https://api.weatherapi.com/v1/current.json?key=f3e591eb3244404a86a171422211806&q=Pune&aqi=no"
        ).on("data", (chunk) => {
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            // console.log(arrData[0].current.temp_c);
            const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
             res.write(realTimeData);
            // console.log(realTimeData);
        }).on("end", (err) => {
            if (err)
                return console.log("connection closed due to errors", err);
            res.end();
        });
   } 
});

server.listen(8000, '127.0.0.1');