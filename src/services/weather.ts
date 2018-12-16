import * as DarkSky from 'dark-sky'
import * as moment from 'moment'

export class Weather {
    adapter: DarkSky = null;

    constructor(apiKey) {
        this.adapter = new DarkSky(apiKey);
    }
    async getYesterdayData(options: HistoryOptions): Promise<WeatherHistory[]> {
        const hdata = await this.adapter
            .options({
                latitude: options.latitude,
                longitude: options.longitude,
                time: moment().subtract(1, 'day').format('YYYY-MM-DD'),
                language: 'en',
                // exclude: ['daily', 'hourly'],
                extendHourly: true,
                units: 'si',
            })
            .get();

        if (!hdata || !hdata.hourly || !hdata.hourly.data) {
            throw new Error('Bad response format from DarkSky')
        }

        return hdata.hourly.data.map((row) => {
            return {
                time: Number(row.time) * 1000,
                temperature: row.temperature,
                summary: row.summary,
                provider: 'darksky',
            }
        })
    }
}

type WeatherHistory = {
    time: Number,
    temperature: Number,
    summary: String,
    provider: String,
}

type HistoryOptions = {
    latitude: Number,
    longitude: Number,
    time?: String,
}
