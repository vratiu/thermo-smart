import { Thermostat } from './services/thermostat';
import { connect } from 'mongoose';
export const run = async function (config: ThermostatStatusConfig) {
    connect(config.mongodb.uri, config.mongodb.options);

    const therm = new Thermostat(config.credentials)

    return therm.readStatus();
}

export type ThermostatStatusConfig = {
    mongodb: {
        options: any,
        uri: string,
    },
    credentials: {
        email: string,
        password: string,
    },
}
