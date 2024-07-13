const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    issue: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, default: 'pending' },
    rejectedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    acceptedBy: { // New field to track who accepted the issue
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);
