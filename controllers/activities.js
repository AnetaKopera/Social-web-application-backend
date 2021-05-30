const { validationResult } = require('express-validator');

const Activity = require('../models/activity');

exports.fetchPublicActivities = async (req, res, next) => {

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const [allActivities] = await Activity.fetchPublicActivities();
		res.status(200).json(allActivities);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.fetchPublicActivitiesUnlimited = async (req, res, next) => {

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const [allActivities] = await Activity.fetchPublicActivitiesUnlimited();
		res.status(200).json(allActivities);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.fetchPublicActivitiesForUser = async (req, res, next) => {

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const [allActivities] = await Activity.fetchPublicActivitiesForUser(req.body.id_user);
		res.status(200).json(allActivities);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.fetchPublicActivitiesForUserUnlimited = async (req, res, next) => {

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const [allActivities] = await Activity.fetchPublicActivitiesForUserUnlimited(req.body.id_user);
		res.status(200).json(allActivities);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.fetchAllActivitiesForUser = async (req, res, next) => {

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const [allActivities] = await Activity.fetchAllActivitiesForUser(req.body.id_user);
		res.status(200).json(allActivities);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.fetchAllActivitiesForUserUnlimited = async (req, res, next) => {

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const [allActivities] = await Activity.fetchAllActivitiesForUserUnlimited(req.body.id_user);
		res.status(200).json(allActivities);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};


exports.friendActivities = async (req, res, next) => {

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const [allActivities] = await Activity.fetchFriendActivities(req.body.idFriend);
		res.status(200).json(allActivities);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.friendActivitiesUnlimited = async (req, res, next) => {

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const [allActivities] = await Activity.fetchFriendActivitiesUnlimited(req.body.idFriend);
		res.status(200).json(allActivities);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};


exports.getActivityDetails = async (req, res, next) => {

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const activity = await Activity.getActivityDetails(req.body.id);
		res.status(200).json(activity[0][0]);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.postActivity = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const id_book = req.body.id_book;
	const description = req.body.description;
	const id_type_of_activity = req.body.id_type_of_activity;
	const id_owner = req.body.id_owner;
	const date = req.body.date;
	const visibility = req.body.visibility;
	const grade = req.body.grade;
	if (grade != null) {
		try {
			const activity = {
				id_book: id_book,
				description: description,
				id_type_of_activity: id_type_of_activity,
				grade: grade,
				id_owner: id_owner,
				date: date,
				visibility: visibility
			};
			const result = await Activity.saveWithGrade(activity);
			res.status(201).json({ message: 'Activity created' });
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	} else {
		try {
			const activity = {
				id_book: id_book,
				description: description,
				id_type_of_activity: id_type_of_activity,
				id_owner: id_owner,
				date: date,
				visibility: visibility
			};
			const result = await Activity.save(activity);
			res.status(201).json({ message: 'Activity created' });
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

};

exports.deleteActivity = async (req, res, next) => {
	try {

		const deleteCommentsResponse = await Activity.deleteComments(req.body.id);

		const deleteResponse = await Activity.delete(req.body.id);
		res.status(200).json(deleteResponse);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.reportActivity = async (req, res, next) => {
	try {

		const reportActivityResponse = await Activity.reportActivity(req.body.id);
		res.status(200).json(reportActivityResponse);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.deleteComment = async (req, res, next) => {
	try {

		const deleteCommentResponse = await Activity.deleteComment(req.body.id);

		res.status(200).json(deleteCommentResponse);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.getComments = async (req, res, next) => {
	try {
		const [allComments] = await Activity.getComments(req.body.idActivity);
		res.status(200).json(allComments);
	}
	catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.saveComment = async (req, res, next) => {
	try {
		const savedComment = await Activity.saveComment(req.body.idOwner, req.body.idActivity, req.body.comment);
		res.status(200).json(savedComment);
	}
	catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.reportComment = async (req, res, next) => {
	try {

		const reportCommentResponse = await Activity.reportComment(req.body.id);
		res.status(200).json(reportCommentResponse);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.editComment = async (req, res, next) => {
	try {

		const result = await Activity.editComment(req.body.comment_id, req.body.text);
		res.status(200).json(result);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.getActivityTypes = async (req, res, next) => {
	try {
		const [allActivityTypes] = await Activity.getActivityTypes();
		res.status(200).json(allActivityTypes);
	}
	catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}