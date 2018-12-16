import { Schema, model } from 'mongoose'

const schema  = new Schema(
    {
        time: { type: Number, index: { unique: true } },
        temperature: Number,
        summary: String,
        provider: String,
    },
    {
        collection: 'weather_historical',
    })

export default model('WeatherHistory', schema);
