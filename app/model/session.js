const Db               = require('../database');

var ObjectId = Db.Schema.ObjectId;
var schema = Db.Schema({
    token: String,
    user: { type: ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now },
    last_updated: { type: Date, default: Date.now }
});

schema.statics.findBySessionId = function(session_id, cb) {
    return this.find({ _id: session_id }, cb);
};

var Session = Db.model('Session', schema);

module.exports = Session;
