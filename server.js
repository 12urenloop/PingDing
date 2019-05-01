const express = require('express');
const app = express();
const ping = require('ping');
const say = require('say');
const https = require('https');
const fs = require('fs');

const STATIONS = JSON.parse(fs.readFileSync('./stations.json', 'utf8'));

let lastStatus = {}

STATIONS.forEach((n) => {
        lastStatus[n.address] = true
});

app.get('/api', (req, res) => {
	let promises = [];
	STATIONS.forEach((host) =>  {
                if (host.pingOnly) {
                        promises.push(ping.promise.probe(host.address).then((val) => {
                                return {
                                        "name": host.name,
                                        "host": host.address,
                                        "alive": val.alive,
                                        "canvasX": host.canvasX,
                                        "canvasY": host.canvasY,
                                        "color": host.color,
                                        "host": host.address
                                };
                        }));
                } else {
                        promises.push(new Promise((resolve, reject) => {
                                let req = https.get(host.address, (res) => {
                                        res.on("error", reject);
                                        resolve({
                                                "name": host.name,
                                                "host": host.address,
                                                "alive": res.statusCode == 200,
                                                "canvasX": host.canvasX,
                                                "canvasY": host.canvasY,
                                                "color": host.color,
                                                "host": host.address
                                        });
                                });
                                req.end();
                        }).catch());
                }
        });
	Promise.all(promises).then((values) => {
		let response = [];
		values.forEach((val) => {
                        const name = val.name || val.host;

                        const stationStatus = {
                                "name": name,
                                "alive": val.alive,
                                "canvasX": val.canvasX,
                                "canvasY": val.canvasY,
                                "color": val.color,
                                "host": val.host
                        };
                        response.push(stationStatus);
                        
			if (!val.alive && lastStatus[val.host]) {
				text = name + " is down"
				console.log(text);
				say.speak(text);
				lastStatus[val.host] = false;
			}
			if (val.alive && !lastStatus[val.host]) {
				text = name + " is up"
				console.log(text);
				say.speak(text);
				lastStatus[val.host] = true;
			}
		});
		res.send(response);
	}).catch(console.err);
});

app.use(express.static("public"));

app.listen(3000, () => {
  console.log('listening on port 3000!')
});
