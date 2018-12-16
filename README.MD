# Making the smart thermometer even smarter

## Weather history
Collects historical weather data and tracks it in a Mongo db.
You will need to set up a mongoDB connction and register for a APIKey with DarkSky.net.

### Required packages
All required packages are specidied in package.json, including `wt-cli`.
### Building
`$npm install`

`$npm run build`
### Webtask installation
After building the project run `bash$ ./src/webtask/weather_history.sh` from the root folder of the project.
This script will collect desired task name, mongo uri and darsky api token and then will create a cron task on webtask.io
