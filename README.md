# poolPi
## WORK IN PROGRESS...

This is first project using node.js. It's a local application server that will be used as a timer for my pool pump and lighting in my backyard with a Raspberry Pi Zero W.

While I'm using this for my pool equipment, the Johnny-Five library has been implemented so expansion to other devices should be fairly easy. I plan to add additional valve solenoids and some sensors for reporting later on. 

The system does not use a central database, but rather several JSON files to hold configurations. This will likely be updated in the future as the front end is developed more. 

In it's current state, most of the system is being ran in the background with little to 

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
 - raspi-iodate-time
 - node-schedule
 - weather-js
 - socket.io
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

### Configuring Devices

### Setting the Timer schedule

## Using the API

