# PingDing

Utility for checking 12urenloop counting stations and graphically displaying them.

## Setup

1. Set up stations.json:

```
[
	{
		"address": "10.0.20.3",  // The address to check
		"canvasX": 350,          // The X-location on the html5 canvas (600 by 400)
		"canvasY": 50,           // The Y-location on the html5 canvas (600 by 400)
		"name": "Mr. White",     // The name of the station
		"color": "#bbbbbb",      // The color of the station
		"pingOnly": true         // If true, only ping the address, else check if the http response is 200
	},
	// ...
]
```

2. Start the server:

```
      npm install
      npm start
```

3. Check out localhost:3000
