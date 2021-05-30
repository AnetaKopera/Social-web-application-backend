const Messages = require('../models/messages');

exports.friendsList = async (req, res, next) => {
	try {
		let [friends_sender] = await Messages.findAllConversationPartners(req.params.id);
		res.status(200).json(friends_sender);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};


exports.messages = async (req, res, next) => {
	try {
		let [messages_with_user] = await Messages.findAllMessagesWithUser(req.body.id, req.body.logedUserID);
		res.status(200).json(messages_with_user);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.saveMessage = async (req, res, next) => {
	try {

		let respone_message = await Messages.saveMessage(req.body.message, req.body.receiver, req.body.sender);
		res.status(201).json();
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.markAsReaded = async (req, res, next) => {
	try {
		let respone_message = await Messages.markAsReaded(req.body.id_user, req.body.id_friend);
		res.status(200).json(respone_message);

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};