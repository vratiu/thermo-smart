// import { basename, join } from 'path'
// import { readdirSync } from 'fs'
// import { Model } from 'mongoose'
import WeatherHistory from './weather_history'
import KVStore from './kv_store'
import ThermostatStatus from './thermostat_status'

/**
 * This does not work on webtask
 */
/*
const db :{
    [key: string]: Model<any, {}>;
} = {}

const base = basename(__filename);
readdirSync(__dirname)
.filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== base) && (file.slice(-3) === '.js');
})
.forEach((file) => {
    const model = require(join(__dirname, file)).default

    db[model.modelName] = model;
});
module.exports = db;
*/
export {
    WeatherHistory,
    KVStore,
    ThermostatStatus,
}
