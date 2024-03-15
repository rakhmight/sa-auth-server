import { Schema, model } from 'mongoose'
import { SystemType } from './enums'

const schema: Schema = new Schema<SystemI>(
    {
        login: {
            type: String,
            required: true,
            unique: true
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
            match: /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/i,
            minLength: 7,
            maxLength: 15,
        }
    },
    { 
        timestamps: true,
        strict: true,
        strictQuery: true
    }
)

export const SystemModel = model<SystemI, SystemModelI>('System', schema)