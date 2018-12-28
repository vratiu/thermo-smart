import { Schema, model } from 'mongoose'

const schema = new Schema(
    {
        key: { type: String, index: { unique: true } },
        value: Schema.Types.Mixed,
    },
    {
        collection: 'kv_store',
    })

export default model('KVStore', schema);
