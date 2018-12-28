import Axios from 'axios'
import { Thermostat } from '../services/thermostat';

export class Poer {
    options: PoerOptions = null;
    defaultOptions = {
        baseUrl: 'http://open.poersmart.com:8012',
        // tslint:disable-next-line
        userAgent: 'Mozilla/5.0 (Linux; Android 8.1.0; ONEPLUS A5010 Build/OPM1.171019.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.110 Mobile Safari/537.36 Html5Plus/1.0'
    }

    constructor(config: PoerOptions) {
        this.options = Object.assign({}, this.defaultOptions, config);
        Axios.defaults.headers = {
            'content-type': 'application/json',
            'user-agent': this.options.userAgent,
        }
    }

    async login(email: string, password: string): Promise<LoginResult> {
        // prioritze cached result
        if (this.options.storage) {
            const cached = await this.options.storage.get('poer_login_result');
            if (cached) {
                return cached
            }
        }
        try {
            const res = await Axios.post(
                `${this.options.baseUrl}/newAuth/login`,
                {
                    Email: email,
                    Passwd: password,
                    TimezoneOffset: 0, // let's go utc
                    Language: 'English',
                },
            )

            if (this.options.storage) {
                try {
                    this.options.storage.set('poer_login_result', res.data);
                } catch (es) {
                    console.error('Error writing to storage');
                    console.error(es);
                }
            }

            return res.data;
        } catch (e) {
            console.error(e);
            console.log(e.response);
            throw new Error('Login failed');
        }
    }

    async getStatus() {
        try {
            const [thermostat, gateway] = await Promise.all([
                this.getThermostatStatus(),
                this.getGatewayStatus(),
            ]);
            const actuator = await this.getActuatorStatus(thermostat.Id)

            return {
                thermostat,
                gateway,
                actuator,
            }
        } catch (e) {
            console.error('Cannot get status');
            console.error(e);
            throw e;
        }
    }

    async getThermostatStatus(): Promise<ThermostatStatusResult> {
        const creds = this.options.credentials;
        const login = await this.login(creds.email, creds.password);
        try {
            const res = await Axios.get(
                `${this.options.baseUrl}/newUsers/${login.Id}/${login.LocateId}/nodes`,
                {
                    auth: {
                        username: creds.email,
                        password: creds.password,
                    },
                },
            );
            return res.data[0];
        } catch (e) {
            console.error(e);
            console.log(e.response);
            throw e
        }
    }

    async getActuatorStatus(nodeId: number): Promise<ActuatorStatusResult> {
        const creds = this.options.credentials;
        const login = await this.login(creds.email, creds.password);
        try {
            const res = await Axios.get(
                `${this.options.baseUrl}/newUsers/${login.Id}/nodeList/${nodeId}/actuatorStatus`,
                {
                    auth: {
                        username: creds.email,
                        password: creds.password,
                    },
                },
            );
            return res.data;
        } catch (e) {
            console.error(e);
            console.log(e.response);
            throw e
        }
    }

    async getGatewayStatus(): Promise<GatewayStatusResult> {
        const creds = this.options.credentials;
        const login = await this.login(creds.email, creds.password);
        try {
            const res = await Axios.get(
                `${this.options.baseUrl}/newUsers/${login.Id}/${login.LocateId}/gateway`,
                {
                    auth: {
                        username: creds.email,
                        password: creds.password,
                    },
                },
            );
            return res.data[0];
        } catch (e) {
            console.error(e);
            console.log(e.response);
            throw e
        }
    }
}

export type PoerOptions = {
    credentials: {
        email: string,
        password: string,
    },
    storage: {
        get(key: string),
        set(key: string, value: any),
    },
    baseUrl?: string,
    userAgent?: string,
}

export type LoginResult = {
    'Id': number, // 8859,
    'LocateId': number, // 11417,
    'GatewayId': number, // 0,
    'MajorNodeId': number // 0,
    'Name': string, // 'Virgil',
    'Email': string, // 'vu@yahoo.com',
    'Country': string, // 'Romania',
    'Postcode': string // '400060',
    'DisplayMode': number, // 0,
    'Latitude': number, // 0,
    'Longitude': number, // 0,
    'Notes': string, // '',
}

export type ThermostatStatusResult = {
    'Id': number, // 278075812100722,
    'GatewayId': number, // 280274838350249,
    'RfLinkActuator': boolean, // true,
    'MakePowerPercent': number, // 4,
    'NodeName': string, // 'fce892003a72',
    'NodeSN': string, // 'fce892003a72',
    'EnergySaveing': number, // 0,
    'ActionFlag': number, // 5,
    'CurTemperature': number, // 1890,
    'NodeType': number, //  0,
    'BatteryPercent': number, // 86,
    'Humidity': number, // 54,
    'RfLinkGateway': boolean, // true,
    'WindowOpen': boolean, // false,
    'HolidayIsOpen': boolean, // true,
    'OverrideIsOpen': boolean, // true,
    'OverrideTemperature': number, // 1890,
    'OverrideTime': number, // 61200,
    'VoltTrl': number, // 587,
    'VoltCap': number, // 0,
    'SoftVersion': string, // 'v2.0',
    'HardVersion': string, // 'v1.0',
    'Frequency': string, // '868M',
    'BackWorkMode': number, // 0,
    'WorkMode': number, // 0,
    'DisplayMode': number, // 0,
    'ManTemprature': number, // 810,
    'EcoTemprature': number, // 1710,
    'OffTemprature': number, // 450,
    'HolidayEnable': false,
    'HolidayStart': number, // 0,
    'HolidayEnd': number, // 0,
    'WriteStatus': number, // 1,
    'SptTemprature': number, // 1890,
    'LocateId': number, // 11417,
}

export type ActuatorStatusResult = {
    'GetStatus': boolean, // true,
    'ErrorMessage': string, // "",
    'LinkStatus': boolean, // true,
    'HeatStatus': boolean, // false,
    'NodeID': number, // 278075812100722
}

export type GatewayStatusResult = {
    'Id': number, // 280274838350249,
    'IpAddr': string, // '8.13.7.17:4097',
    'GatewaySN': string, // 'fee8922de9a9',
    'GatewayName': string, // 'fee8922de9a9',
    'GatewayCode': string, // '7455d20ca523439286b3100a29ecbbe6',
    'USoftVersion': number, // 21,
    'UHardVersion': number, // 138,
    'SoftVersion': string, // 'v2.1',
    'HardVersion': string, // 'v1.0',
    'Frequency': string, // '868M',
    'NodeSum': number, // 1,
    'WifiRSSI': number, // -39,
    'IsOnline': boolean, // true,
    'ZoneCity': string, // 'Windhoek',
    'ZoneOffset': number, // 120,
    'DstEnable': boolean, // false,
    'DstOffset': number, // 0,
    'DstStart': number, // 0,
    'DstEnd': number, // 0,
}
