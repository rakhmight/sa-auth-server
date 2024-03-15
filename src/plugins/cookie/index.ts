const path = require('path')
require('dotenv').config({path: path.join(__dirname, `../../.env`)})

export const cookieParams = {
    secret: process.env.COOKIE_SECRET,
}