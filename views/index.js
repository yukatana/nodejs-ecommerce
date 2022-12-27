//Handlebars import and config
const handlebars = require('express-handlebars')
const hbs = handlebars.create({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: './views/layout',
    partialsDir: './views/partials/'
})

module.exports = hbs