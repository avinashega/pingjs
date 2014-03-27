var i = require('../i');
var Q = require('q');
var agendaJobs = i.db().agendaJobs;
var config = require('getconfig');
var open = require('amqplib').connect(config.amqp.RABBITMQ_TX_URL);
var ObjectID = require('mongoskin').ObjectID;
Q.longStackSupport = true;


_setJobIsPinging = function(id, status) {
    Q.nbind(agendaJobs.update, agendaJobs) (
        {
            _id: ObjectID.createFromHexString(id)
        },
        {
            $set: {isPinging: status}
        }
    );
};

module.exports = function (agenda) {
    agenda.define('ping', {concurrency: 1000}, function (job, done) {
        var jobId = job.attrs._id;
        console.log("[pingJob] [.] Posting job ID "+jobId);
        open.then(function(conn) {
                return conn.createChannel()
                .then(function(ch) {
                    ch.sendToQueue(config.amqp.job_queue, new Buffer(String(jobId)));
                    _setJobIsPinging(jobId.toString(), true);
                    done();
                });
            }).then(null, console.warn);
    });
};