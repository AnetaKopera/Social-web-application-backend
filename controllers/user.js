const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Activity = require('../models/activity');
const Messages = require('../models/messages');

const fs = require('fs');
const path = require('path');

exports.userInformation = async (req, res, next) => {
	try {
		let user = await User.findById(req.params.id);
		res.status(200).json(user[0][0]);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.userFriends = async (req, res, next) => {
	try {
		let friends = await User.getFriends(req.params.id);
		res.status(200).json(friends[0]);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.updateDescription = async (req, res, next) => {
	try {

		let result = await User.updateDescription(req.body.user_id, req.body.description);
		res.status(200).json(result);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.deleteDescription = async (req, res, next) => {
	try {

		let result = await User.deleteDescription(req.body.user_id);
		res.status(200).json(result);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.updatePassword = async (req, res, next) => {
	try {
		const id = req.body.id;
		const oldPassword = req.body.old_password;
		const newPassword = req.body.new_password;

		let user = await User.findById(id);

		user = user[0][0];

		const isEqual = await bcrypt.compare(oldPassword, user.password);

		if (!isEqual) {
			const error = new Error('Wrong password');
			error.statusCode = 401;
			throw error;
		}

		const hashedPassword = await bcrypt.hash(newPassword, 12);

		const result = await User.updatePassword(id, hashedPassword);
		res.status(200).json(result);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.updateName = async (req, res, next) => {
	try {

		let result = await User.updateName(req.body.user_id, req.body.name);
		res.status(200).json(result);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.updateSurname = async (req, res, next) => {
	try {

		let result = await User.updateSurname(req.body.user_id, req.body.surname);
		res.status(200).json(result);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.updateNameSurname = async (req, res, next) => {
	try {

		let result = await User.updateNameSurname(req.body.user_id, req.body.name, req.body.surname);
		res.status(200).json(result);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.updateEmail = async (req, res, next) => {
	try {

		let result = await User.updateEmail(req.body.user_id, req.body.email);
		res.status(200).json(result);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.updatePicture = async (req, res, next) => {
	try {

		let result = await User.updatePicture(req.file.destination, req.file.filename, req.body.user_id);
		res.status(200).json(result);
		if (req.body.photo_name != undefined && req.body.photo_name != null) {
			let directory = 'C:/xampp/htdocs/social-app/images/users';
			fs.readdir(directory, (err, files) => {
				if (err) throw err;

				for (const file of files) {

					if (file == req.body.photo_name) {
						fs.unlink(path.join(directory, file), err => {
							if (err) throw err;
						});
					}

				}
			});
		}


	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.deletePicture = async (req, res, next) => {
	try {

		let result = await User.deletePicture(req.body.user_id);

		if (req.body.photo_name != undefined && req.body.photo_name != null) {
			let directory = 'C:/xampp/htdocs/social-app/images/users';
			fs.readdir(directory, (err, files) => {
				if (err) throw err;

				for (const file of files) {

					if (file == req.body.photo_name) {
						res.status(200).json({ success: "success" });
						fs.unlink(path.join(directory, file), err => {
							if (err) throw err;
						});
					}

				}
			});
		} else {
			res.status(400).json({ error: "That photo doesnt exist" });
		}

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.inviteFriend = async (req, res, next) => {
	try {

		let result = await User.inviteFriend(req.body.user_id, req.body.friend_id);
		res.status(200).json(result);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.invitedMeList = async (req, res, next) => {
	try {

		let result = await User.invitedMeList(req.body.user_id);

		res.status(200).json(result[0]);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.iInvitedList = async (req, res, next) => {
	try {

		let result = await User.iInvitedList(req.body.user_id);

		res.status(200).json(result[0]);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.acceptInvitation = async (req, res, next) => {
	try {

		let result1 = await User.deleteInvitation(req.body.user_id, req.body.friend_id);
		let result2 = await User.addToFriends(req.body.user_id, req.body.friend_id);

		res.status(200).json(result2);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.declineInvitation = async (req, res, next) => {
	try {

		let result1 = await User.deleteInvitation(req.body.user_id, req.body.friend_id);

		res.status(200).json(result1);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.deleteFriend = async (req, res, next) => {
	try {

		let messages = await User.deleteMessagesWithUser(req.body.user_id, req.body.friend_id);
		let result = await User.deleteFriend(req.body.user_id, req.body.friend_id);

		res.status(200).json(result);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.deleteAccount = async (req, res, next) => {
	try {
		const allActivities = await Activity.fetchAllActivitiesForUser(req.body.user_id);

		for (let i = 0; i < allActivities[0].length; i++) {
			let toCheckIfReported = (await Activity.getComments(allActivities[0][i].id))[0];
			if (toCheckIfReported !== undefined) {
				for (let j = 0; j < toCheckIfReported.length; j++) {
					let deletedReportedComment = await Activity.deleteReportComment(toCheckIfReported[j].id);
				}
			}
			const deleteCommentsInMyActivity = await Activity.deleteComments(allActivities[0][i].id);
			const deletedActivity = await Activity.deleteReportAcctivity(allActivities[0][i].id);
			const deleteActivity = await Activity.delete(allActivities[0][i].id);
		}
		let toCheck = await Activity.getAllUserComments(req.body.user_id)[0];
		if (toCheck !== undefined) {
			for (let i = 0; i < toCheck.length; i++) {
				const deletedComment = await Activity.deleteReportComment(toCheck[i].id);
			}
		}
		const allExistingComments = await Activity.deleteAllUserComments(req.body.user_id);
		const allFriends = await User.deleteAllMyFriends(req.body.user_id);
		const allInvitations = await User.deleteAllMyInvitations(req.body.user_id);
		const allMessages = await Messages.deleteAllMyMessages(req.body.user_id);
		const user = (await User.findById(req.body.user_id))[0][0];
		const account = await User.deleteAccount(req.body.user_id);
		if (user.photo_name != undefined && user.photo_name != null) {
			let directory = 'C:/xampp/htdocs/social-app/images/users';
			fs.readdir(directory, (err, files) => {
				if (err) throw err;
				for (const file of files) {
					if (file == user.photo_name) {
						fs.unlink(path.join(directory, file), err => {
							if (err) throw err;
						});
					}
				}
			});
		}
		res.status(200).json(allExistingComments, allFriends, allInvitations, allMessages, account);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.getMatchingStrangers = async (req, res, next) => {
	try {

		let result = await User.getMatchingStrangers(req.body.user_id, req.body.stranger);

		res.status(200).json(result[0]);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.markAsReaded = async (req, res, next) => {
	try {

		let result = await User.markAsReaded(req.body.user_id);
		res.status(200).json(result);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}

exports.markOneInvitationAsReaded = async (req, res, next) => {
	try {

		let result = await User.markOneInvitationAsReaded(req.body.user_id, req.body.friend_id);
		res.status(200).json(result);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
}