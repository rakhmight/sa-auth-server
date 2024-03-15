import { Schema, model } from 'mongoose'

const schema: Schema = new Schema<SpecialtyI>(
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
        ref: {
            type: Schema.Types.ObjectId,
            ref: 'Formation',
            required: true
        },
    },
    { 
        timestamps: true,
        strict: true,
        strictQuery: true
    }
)

export const SpecialtyModel = model<SpecialtyI, SpecialtyModelI>('Specialty', schema)