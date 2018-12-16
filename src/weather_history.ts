
import { Weather } from './services/weather'
// @ts-ignore:next-line
import { WeatherHistory } from './models'
import { connect } from 'mongoose';

export const run = async (config: HistoryConfig) => {
    connect(config.mongodb.uri, config.mongodb.options);
    const weather = new Weather(config.weather_api.apiKey);
    const entries = await weather.getYesterdayData(config.location);
    // because we have an unique constraint bulk inserting with same timestamp will fail
    const toSave = entries.map((entry) => {
        const m = new WeatherHistory(entry);
        return m.save()
            .then((r) => {
                console.log(entry, 'OK')
                return r;
            })
            .catch((err) => {
                if (err.code === 11000) {
                    console.log(entry, 'DUPLICATE')
                    return m;
                }
                throw err
            })
    })
    await Promise.all(toSave);
    console.log('done')
}

type HistoryConfig = {
    mongodb: {
        options: any,
        uri: string,
    },
    weather_api: {
        apiKey: string,
        provider: string,
    }
    location: {
        latitude: Number,
        longitude: Number,
    },
}
