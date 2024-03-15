import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'
import { StudentEducationForms, StudentEducationLevels, UserPermissions, UserRoles } from './enums';

const schema = new Schema<UserI>(
    {
        auth: {
            password: {
                type: String,
                required: true
            },
            login: {
                type: String,
                unique: true,
                required: true,
                minLength: 4,
                maxLength: 24
            }
        },
        bio: {
            firstName: {
                type: String,
                required: true,
                trim: true
            },
            lastName: {
                type: String,
                required: true,
                trim: true
            },
            patronymic: {
                type: String,
                required: true,
                trim: true
            },
            phoneNumbers: [{
                type: String,
                match: /\+998\s\d{2}\s\d{3}\s\d{2}\s\d{2}/i,
                required: true,
                maxLength: 17,
                minLength: 17,
                trim: true
            }],
            dateOfBirth: {
                type: Date,
                required: true
            },
            geo: {
                countryISO: {
                    type: String,
                    required: true,
                    match: /[A-Z]{2}/i,
                    maxLength: 2,
                    minLength: 2,
                    uppercase: true,
                    trim: true
                },
                region: {
                    type: Number,
                    required: true
                }
            },
            PINFL: {
                type: String,
                required: true,
                maxLength: 14,
                minLength: 14,
                match: /\d{14}/i,
                trim: true
            },
            passport: {
                type: String,
                required: true,
                match: /[A-Z]{2}}\d{7}/i,
                maxLength: 9,
                minLength: 9,
                trim: true
            }
        },
        system: {
            role: {
                type: String,
                required: true,
                enum: Object.values(UserRoles)
            },
            permissions: [{
                type: String,
                required: true,
                enum: Object.values(UserPermissions)
            }]
        },
        status: {
            isDeleted: {
                type: Boolean,
                required: true,
                default: false
            },
            isBlocked: {
                type: Boolean,
                required: true,
                default: false
            }
        },
        roleProperties: {
            formation: {
                type: Schema.Types.ObjectId,
                ref: 'Formation'
            },
            position: {
                type: Number
            },
            postgraduateEducation: {
                status: {
                    type: Boolean
                },
                startDate: {
                    type: Date || null
                }
            },
            qualificationIncreasing: {
                status: {
                    type: Boolean,
                    required: true
                },
                startDate: {
                    type: Date || null,
                    required: true
                }
            },

            /////

            formOfEducation: {
                type: String,
                enum: Object.values(StudentEducationForms)
            },
            dateOfAdmission: {
                type: Date
            },
            specialty: {
                type: Schema.Types.ObjectId,
                ref: 'Specialty'
            },
            group: {
                type: Number
            },
            education: {
                type: String,
                enum: Object.values(StudentEducationLevels)
            }
        }
    },
    { 
        timestamps: true,
        strict: true,
        strictQuery: true
    }
)

schema.methods.comparePasswords = async function (hashedPassword: string, candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
}
  
schema.pre('save', async function () {
  // Hash password if the password is new or was updated
  if (this.isModified('auth.password')) return;

  // Hash password with costFactor of 16
  try {
    this.auth.password = await bcrypt.hash(this.auth.password, 16)
  } catch (error) {
    throw error
  }
})

export const UserModel = model<UserI, UserModelI>('User', schema)