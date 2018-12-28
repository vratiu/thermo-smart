#!/bin/bash
# create and schedule thermostat status tracking task
cp ./package.json ./dist/webtask/
printf "Plese enter task name:"
read TASK_NAME
printf "Please enter mongo uri (with user and pass):"
read MONGO_URI
printf "Poer Smart Login \n Email:"
read EMAIL
printf "Password:"
read -s PASSWORD
printf "Installing $TASK_NAME"
wt cron create \
--schedule "*/3 * * * *" --tz UTC \
--name=$TASK_NAME  dist/webtask/thermostat_status.js \
--bundle \
--secret mongo_uri="$MONGO_URI" \
--secret thermostat_email="$EMAIL" \
--secret thermostat_password="$PASSWORD" \
--middleware @webtask/async-function-middleware \
--middleware @webtask/cron-auth-middleware
