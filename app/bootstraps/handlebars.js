var hbs = require('express-hbs'),
    tz = require('timezone'),
    moment = require('moment');

module.exports = function (app) {

    hbs.handlebars.registerHelper("formatDate", function (datetime, format) {
        var DateFormats = {
            short: "DD MMMM - YYYY",
            long: "MM/DD/YYYY,  hh:mm a"
        };

        return moment(datetime).format(DateFormats['long']);
    });
    /**
     * Date Format
     * Converts UNIX Epoch time to DD.MM.YY
     * 1343691442862 -> 31.07.12
     * Usage: {{dateFormat yourDate}}
     */
    hbs.handlebars.registerHelper('dateFormat', function(context) {
        var date = tz(context,"%m/%d/%Y");
        return date;
    });

    /**
     * Date Format (datetime)
     * Converts UNIX Epoch time to YYYY-MM-DD
     * 1343691442862 -> 2012-7-31
     * Usage: {{dateFormatTime yourDate}}
     */
    hbs.handlebars.registerHelper('dateFormatTime', function(context) {
        var date = new Date(context);
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    });

    /**
     * Duration Format
     * Converts UNIX Epoch time to H.MM.SS
     * 127478 -> 2:07
     * Usage: {{durationFormat yourTime}}
     */
    hbs.handlebars.registerHelper('durationFormat', function(context) {
        var duration = Math.floor(context / 1000),
            hours = (duration >= 3600) ? Math.floor(duration / 3600) : null,
            mins = (hours) ? Math.floor(duration % 3600 / 60) : Math.floor(duration / 60),
            secs = Math.floor(duration % 60);
        return (hours ? hours + ':' : '') + (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
    });
    hbs.handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    });
    /**
     * Duration Format ISO
     * Converts UNIX time to ISO 8601 date format
     * 127478 -> PT2M7S
     * Usage: {{durationFormatISO yourTime}}
     */
    hbs.handlebars.registerHelper('durationFormatISO', function(context) {
        var duration = Math.floor(context / 1000),
            hours = Math.floor(duration / 3600),
            mins = (hours) ? Math.floor(duration % 3600 / 60) : Math.floor(duration / 60),
            secs = Math.floor(duration % 60);
        return 'PT' + hours + 'H' + mins + 'M' + secs + 'S';
    });

    app.engine('hbs', hbs.express3({
        partialsDir: __dirname + '/../partials/',
        layoutsDir: __dirname + '/../layouts/'
    }));
    app.set('views', __dirname + '/../views/');
    app.set('view engine', 'hbs');
};
