const { validationResult } = require('express-validator');

const Book = require('../models/book');

exports.findByTitle = async (req, res, next) => {

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const [booksWithSearchingTitle] = await Book.findByTitle(req.body.title);
		res.status(200).json(booksWithSearchingTitle);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.fetchRanking = async (req, res, next) => {

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		let [booksRanking] = await Book.fetchRanking();
		res.status(200).json(booksRanking);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};


exports.detailBook = async (req, res, next) => {

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const book = await Book.getBook(req.params.id);
		res.status(200).json(book[0][0]);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

