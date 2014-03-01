var Agenda = require('agenda'),
    config = require('getconfig'),
    url = config.mongodb.uri + '?auto_reconnect',
    agenda = new Agenda({
        db: {
            address: url,
            collection: 'agendaJobs'
        },
        processEvery: '10 seconds'
    });

module.exports = agenda;