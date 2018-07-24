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
-- devLog.json: Logs actions to the GPIO API
-- schedule.json: All of the schedules for the timer, including auto off timers
```

# Usage
Coming Soon...

### Configuring the server
Coming Soon...

### Configuring Devices
Coming Soon...

### Setting the Timer schedule
Timers are configured via data/schedule.json file. All the user schedules are stored in an array called 'mySchedules':
```
{
  "mySchedules":[
  {
    "ID": 1,                            /// Schedule ID
    "name": "Pool Pump",                /// Name of your Schedule
    "description": "Summer Hours",      /// Additional Description
    "deviceID": 1,                      /// The device ID from the
    "timertype": "onoff",               /// onoff is standard behavior, but autoOff only uses endTime
    "enabled": 1,                       /// To disable, set to 0
    "startTime": {"h" : 7, "m": 30},    /// 24 hr clock... h: start hour m: start minute
    "endTime": {"h" : 11, "m": 0},      /// 24 hr clock... h: end hour m: end minute (no leading 0's)
    "daysofweek": [0,1,2,3,4,5,6],      /// [Sunday:0,Mon:1,etc...]
    "action": "Relay"                   /// 
  }
  ]
```

## Using the API
There are only a few features to the API:
### GET
  - /gpio/ : API instructions
  - /gpio/pinstatus : Returns all GPIO pins as truthy or falsy in array 'ds'
    - ie...```{
          "ds": [
            null,
            null,
            true,
            false
            ]
          }```
  - /gpio/{Pin Number} : Returns true/false for defined Johnny-Five Relays
    - ie... ```{
          "response": "success!",
          "pin": "P1-7",
          "status": false
          }```
  - /gpio/log : Returns the devLog.json

### POST
  - gpio/{PIN}/{TYPE}/{ONOFF} : To trigger a device, where domains for each value are:
    - PIN: GPIO Pin number
    - TYPE: Relay
    - ONOFF: on | off | toggle

## Other Feature Ideas
- Maintenance Help/Alerts
  - Pool Level
    - Possibly automate w/24V valve to fill the pool periodically during the summer.
  - Filter Clean/Change Schedule
- Add actuators to 3-way Jandy Valves for changing input/output plumbing
- Add pressure transducer on filter for pressure warnings (filter change needed) and automatic shutoff
- Add air bleed valve for removing headspace in filter
- Add 24v valve for emptying pool/filter
