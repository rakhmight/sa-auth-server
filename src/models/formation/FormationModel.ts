import { Schema, model } from 'mongoose'
import { FormationTypes } from './enums'

const schema: Schema = new Schema<FormationI>(
    {
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
        type: {
            type: String,
            enum: Object.values(FormationTypes)
        },
        positions: [{
            id: {
                type: Number
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
            }
        }],
        ref: {
            type: Schema.Types.ObjectId,
            ref: 'Formation'
        },
        generation: {
            type: Number
        },
        child: {
            type: Number
        },
        counter: {
            type: Number
        }
    },
    { 
        timestamps: true,
        strict: true,
        strictQuery: true
    }
)

export const FormationModel = model<FormationI, FormationModelI>('Formation', schema)