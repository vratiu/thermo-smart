import { KVStore } from '../models'

export class KVStorage {
    async get(key: string) {
        const value = await KVStore.findOne({ key });
        return (value ? value.get('value') : null);
    }

    async set(key: string, value: any) {
        const oldVal = await KVStore.findOne({ key });
        const item = (oldVal ? oldVal : new KVStore({ key }));
        item.set({ value });
        return item.save();
    }
}

export default new KVStorage()
