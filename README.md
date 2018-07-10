# poolPi

** WORK IN PROGRESS...**

This is first project using node.js. It's a local application server that will be used as a timer for my pool pump and lighting in my backyard with a Raspberry Pi Zero W. While I could've used Cayenne to have this up and running quickly, I wanted a local network server.

While I'm using this for my pool equipment, the Johnny-Five library has been implemented so expansion to other devices should be fairly easy. I plan to add additional valve solenoids and some sensors for reporting later on. 

The system does not use a central database, but rather several JSON files to hold configurations. This will likely be updated in the future as the front end is developed more. 

Currently the front end is featureless with the backend doing all of the work. 

## Hardware
- Pi Zero W (headless)
- 3.3V logic 120VAC 10A relays
- Waterproof momentary push buttons
- DIN Rail mounts
- 220V SSR (Pool Pump)
- 5V DIN switching PSU

## Software
- Raspbian Stretch 
- node.js 
  - express
  - johnny-five
  - raspi-io
  - date-time
  - node-schedule
  - weather-js
  - socket.io
  - needle
- Twitter Bootstrap 4

Likely to be implemented
- Angular frontend
- SQLite or NoSQL for data store

## General framework
The system relies on a handful of JSON files in the data directory for configuration purposes. 
```
- data
-- config.json: General configuration file for the server
-- devices.json: All of the devices on the system
-- schedule.json: All of the schedules for the timer, including auto off timers
```

# Usage
Coming Soon...

### Configuring the server
Coming Soon...

### Configuring Devices
Coming Soon...

### Setting the Timer schedule
Coming Soon...

## Using the API
Coming Soon...


## Other Feature Ideas
- Pool Level
  - Use a 24V valve to fill the pool periodically during the summer.
- Add actuators to 3-way Jandy Valves for changing input/output plumbing
- Add pressure transducer on filter for pressure warnings (filter change needed) and automatic shutoff
- Add air bleed valve
- Add valve for emptying pool/filter

