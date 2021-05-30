const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const User = require('../models/user');

const authentiacationController = require('../controllers/authentication');

router.post(
	'/signup',
	[
		body('name').trim().isLength({ min: 1 }).withMessage("Empty name field"),
		body('email').isEmail().withMessage('Incorrect email.')
			.custom(async (email) => {
				const user = await User.find(email);
				if (user[0].length > 0) {
					return Promise.reject('Email address already exist.');
				}
			}).normalizeEmail(),

		body('password').trim().isLength({ min: 5 }).withMessage("Password must have at least 5 chars"),

	], authentiacationController.signup
);

router.post('/login', authentiacationController.login);

router.post('/check_token', authentiacationController.checkToken);

router.post('/refresh_token', authentiacationController.refreshToken);

module.exports = router;