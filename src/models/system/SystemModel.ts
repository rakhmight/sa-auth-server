import { Schema, model } from 'mongoose'
import { SystemType } from './enums'

const schema: Schema = new Schema<SystemI>(
    {
        login: {
            type: String,
            required: true,
            unique: true,
            match: /^[a-z]{2}-[a-z]+((-[a-z]+)+)?$/
        },
        name: {
            type: [{
                ISOCode: {
                    type: String,
                    minLength: 2,
                    maxLength: 2,
                    match: /[A-Z]{2}/i,
                    uppercase: true,
                    trim: true
                },
                value: {
                    type: String,
                    trim: true
                }
            }],
            validate: (v:Array<InternationalNameValue>) => Array.isArray(v) && v.length > 0,
        },
        token: {
            type: String,
            required: true,
            minLength: 128,
            maxLength: 128,
        },
        type: {
            type: String,
            required: true,
            enum: Object.values(SystemType)
        },
        IP4Address: {
            type: String,
            required: true,
            match: /^((((http|https):\/\/)?((25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])(:[0-9][0-9][0-9][0-9])?)|(((http|https):\/\/)?((www\.([a-zA-Z0-9\-]{2,63}\.)+[a-zA-Z]{2,63})|(([a-zA-Z0-9\-]{2,63}\.)+[a-zA-Z]{2,63}))(\.[a-zA-Z]{2,63})?))$/gm,
            minLength: 7,
            maxLength: 15,
        },
        receiveNotifications: {
            type: Boolean,
            required: true
        },
        publicSignKey: {
            type: 'string',
            minLength: 1024,
            maxLength: 1024,
        }
    },
    { 
        timestamps: true,
        strict: true,
        strictQuery: true
    }
)

export const SystemModel = model<SystemI, SystemModelI>('System', schema)