#!/bin/bash
# create and schedule weather history task
cp ./package.json ./dist/webtask/
echo "Plese enter task name:"
read TASK_NAME
echo "Please enter mongo uri (with user and pass):"
read MONGO_URI
echo "Please enter DarkSky.net APIToken:"
read WAPI
wt cron create \
--schedule "0 6 * * *" --tz UTC \
--name=$TASK_NAME  dist/webtask/weather_history.js \
--bundle \
--secret mongo_uri="$MONGO_URI" \
--secret weather_api="$WAPI" \
--middleware @webtask/async-function-middleware \
--middleware @webtask/cron-auth-middleware
