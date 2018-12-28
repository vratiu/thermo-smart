import { run, ThermostatStatusConfig } from '../thermostat_status';
import { Context } from './defines';

module.exports = async function (context: Context) {
    const taskCondfig: ThermostatStatusConfig = {
        mongodb: {
            options: {
                useNewUrlParser: true,
                useCreateIndex: true,
            },
            uri: context.secrets['mongo_uri'],
        },
        credentials: {
            email: context.secrets['thermostat_email'],
            password: context.secrets['thermostat_password'],
        },
    }
    await run(taskCondfig);
}
