var fs = require('fs');

module.exports = function (agenda) {
    var jobsDir = __dirname + '/../jobs/';

    fs.readdirSync(jobsDir).forEach(function (file) {
        require(jobsDir + file)(agenda);
    });

    agenda.start();
};