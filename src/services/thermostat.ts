import { Poer } from '../lib/poer'
// @ts-ignore
import { ThermostatStatus } from '../models'
import KVStorage from './kv_storage';
export class Thermostat {
    credentials = null;
    constructor(
        credentials: { email: string, password: string },
    ) {
        this.credentials = credentials;
        return;
    }

    async readStatus() {
        const therm = new Poer({
            credentials: this.credentials,
            storage: KVStorage,
        })

        const status = await therm.getStatus();
        const entry = new ThermostatStatus({
            time: new Date(),
            temperature: status.thermostat.CurTemperature / 90,
            holidayOn: status.thermostat.HolidayEnable,
            batteryPercent: status.thermostat.BatteryPercent,
            humidity: status.thermostat.Humidity,
            overrideOn: status.thermostat.OverrideIsOpen,
            overrideTemperature: status.thermostat.OverrideTemperature / 90,
            thermostatId: `poer_${status.thermostat.LocateId}`,
            heatingOn: status.actuator.HeatStatus,
            gatewayOnline: status.gateway.IsOnline,
            raw: status,
        });

        return entry.save();
    }
}
