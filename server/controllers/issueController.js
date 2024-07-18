const Issue = require('../models/issueModel');

// Submit Issue
const submitIssue = async (req, res) => {
    try {
        const { issue, location, name, phone } = req.body;
        if (!issue || !location || !name || !phone) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Ensure location has lat, lng, and address
        if (!location.lat || !location.lng || !location.address) {
            return res.status(400).json({ success: false, message: 'Location must include lat, lng, and address' });
        }

        const newIssue = new Issue({
            issue,
            location,
            name,
            phone,
        });

        await newIssue.save();

        return res.status(201).json({ success: true, message: 'Issue submitted successfully' });
    } catch (error) {
        console.error('Error submitting issue:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1); 
    var a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

const fetchIssues = async (req, res) => {
    try {
        const serviceProviderId = req.params.serviceProviderId;
        const slat = parseFloat(req.params.lat);
        const slng = parseFloat(req.params.lng);
        const isProviderRequest = req.query.isProviderRequest === 'true';

        console.log(`Service Provider ID: ${serviceProviderId}`);
        console.log(`Service Provider Location: (${slat}, ${slng})`);

        let allIssues = await Issue.find();
        console.log('All Issues:', allIssues);

        allIssues = allIssues.map(issue => {
            const distance = getDistanceFromLatLonInKm(issue.location.lat, issue.location.lng, slat, slng);
            return { ...issue.toObject(), distance };
        });

        console.log('All Issues with Distance:', allIssues);

        const filteredIssues = allIssues.filter(issue => issue.distance < 15); // Change to 15km radius
        console.log('Filtered Issues within 15km:', filteredIssues);

        let filterCriteria;

        if (isProviderRequest) {
            // Fetch pending issues and issues accepted by this specific provider
            filterCriteria = {
                $or: [
                    { status: 'pending', rejectedBy: { $ne: serviceProviderId }, _id: { $in: filteredIssues.map(issue => issue._id) } },
                    { status: 'accepted', acceptedBy: serviceProviderId }
                ]
            };
        } else {
            // Fetch only pending issues
            filterCriteria = {
                status: 'pending',
                rejectedBy: { $ne: serviceProviderId },
                _id: { $in: filteredIssues.map(issue => issue._id) }
            };
        }

        const issues = await Issue.find(filterCriteria);

        console.log('Filtered Issues based on Criteria:', issues);

        res.json({ issues });
    } catch (error) {
        console.error('Error fetching issues:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching issues' });
    }
};

const acceptIssue = async (req, res) => {
    const { id } = req.params;
    const serviceProviderId = req.query.serviceProviderId; // Ensure you pass this in the query params

    try {
        const issue = await Issue.findByIdAndUpdate(
            id,
            { status: 'accepted', acceptedBy: serviceProviderId },
            { new: true }
        );

        if (!issue) {
            return res.status(404).json({ success: false, message: 'Issue not found' });
        }
        res.status(200).json({ success: true, message: 'Issue accepted', issue });
    } catch (error) {
        console.error('Error accepting issue:', error);
        res.status(500).json({ success: false, message: 'An error occurred while accepting the issue' });
    }
};

// Reject Issue
const rejectIssue = async (req, res) => {
    try {
        const { issueId, serviceProviderId } = req.params;
        if (!issueId || !serviceProviderId) {
            return res.status(400).json({ message: 'Issue ID and Service Provider ID are required' });
        }
        const issue = await Issue.findByIdAndUpdate(
            issueId,
            { $addToSet: { rejectedBy: serviceProviderId } }, // Use $addToSet to avoid duplicates
            { new: true }
        );
        if (issue) {
            res.json({ success: true });
        } else {
            res.status(404).json({ message: 'Issue not found' });
        }
    } catch (error) {
        console.error('Error rejecting issue:', error);
        res.status(500).json({ success: false, message: 'An error occurred while rejecting the issue' });
    }
};

module.exports = {
    submitIssue,
    fetchIssues,
    acceptIssue,
    rejectIssue
};
