const moment = require('moment')

const isDate = (value, { req, location, path }) => {
    const fecha = moment(value)
    if (fecha.isValid) {
        return true
    } else {
        return false
    }
}

module.exports = { isDate }