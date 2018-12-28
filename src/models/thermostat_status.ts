import { Schema, model } from 'mongoose'

const schema = new Schema(
    {
        time: { type: Number, index: { unique: true } },
        temperature: Number,
        holidayOn: Boolean,
        batteryPercent: Number,
        humidity: Number,
        overrideOn: Boolean,
        overrideTemperature: Number,
        thermostatId: String,
        heatingOn: Boolean,
        gatewayOnline: Boolean,
        raw: Schema.Types.Mixed,
    },
    {
        collection: 'thermostat_status',
    })

export default model('ThermostatStatus', schema);
