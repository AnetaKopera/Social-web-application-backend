const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {

		return res.status(400).json({ errors: errors.array() });
	}

	const name = req.body.name;
	const surname = req.body.surname;
	const description = req.body.description;
	const email = req.body.email;
	const password = req.body.password;

	try {
		const hashedPassword = await bcrypt.hash(password, 12);

		const userDetails = {
			name: name,
			surname: surname,
			description: description,
			email: email,
			password: hashedPassword
		};

		const result = await User.save(userDetails);
		const user = await User.find(email);
		const storedUser = user[0][0];
		dotenv.config();

		const token = jwt.sign(
			{
				userId: storedUser.id
			},
			process.env.TOKEN_SECRET,
			{ expiresIn: '1h' }
		);

		res.status(200).json({ message: 'User registered and logged in', token: token, userId: storedUser.id, expiration: token.exp });

	} catch (error) {
		if (!error.statusCode) {
			error.status = 500;
		}
		next(error);
	}
};

exports.login = async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	try {
		const user = await User.find(email);

		if (user[0].length !== 1) {

			const error = new Error('A user with this email doesn\'t exist in database');
			error.statusCode = 401;
			throw error;
		}

		const storedUser = user[0][0];

		const isEqual = await bcrypt.compare(password, storedUser.password);

		if (!isEqual) {
			const error = new Error('Wrong password');
			error.statusCode = 401;
			throw error;
		}

		dotenv.config();

		const token = jwt.sign(
			{
				userId: storedUser.id
			},
			process.env.TOKEN_SECRET,
			{ expiresIn: '1h' }
		);

		res.status(200).json({ token: token, userId: storedUser.id, expiration: token.exp });

	} catch (error) {
		if (!error.statusCode) {
			error.status = 500;
		}
		next(error);
	}

};

exports.checkToken = async (req, res, next) => {

	try {

		const token = req.body.token;

		if (token == null || token == undefined) {
			res.status(200).json({ user_id: null, email: null, expiration: null });

		} else {
			dotenv.config();
			let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)

			let date = Date.now();

			if (date >= decodedToken.exp * 1000) {
				res.status(200).json({ user_id: null, email: null, expiration: null });
			} else {
				res.status(200).json({ token: token, userId: decodedToken.userId, expiration: decodedToken.exp });
			}
		}

	} catch (error) {
		res.status(200).json({ user_id: null, email: null, expiration: null });
		next(error);
	}

};


exports.refreshToken = async (req, res, next) => {

	try {

		const token = req.body.token;
		if (token == null || token == undefined) {
			res.status(200).json({ user_id: null, email: null, expiration: null });

		} else {
			dotenv.config();
			let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)

			const new_token = jwt.sign(
				{
					userId: decodedToken.userId,
				},
				process.env.TOKEN_SECRET,
				{ expiresIn: '1h' }
			);

			let newDecodedToken = jwt.decode(new_token, process.env.TOKEN_SECRET);

			res.status(200).json({ token: new_token, userId: newDecodedToken.userId, expiration: newDecodedToken.exp });

		}


	} catch (error) {
		res.status(200).json({ user_id: null, email: null, expiration: null });
		next(error);
	}

};