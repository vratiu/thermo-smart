import { run } from '../weather_history'
import { Context } from './defines';
module.exports = async function (context: Context) {
    const taskCondfig = {
        location: {
            latitude: 46.7693,
            longitude: 23.5901,
        },
        mongodb: {
            options: {
                useNewUrlParser: true,
                useCreateIndex: true,
            },
            uri: context.secrets['mongo_uri'],
        },
        weather_api: {
            apiKey: context.secrets['weather_api'],
            provider: 'DarkSky',
        },
    }
    await run(taskCondfig);
}
