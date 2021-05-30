const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const booksController = require('../controllers/books');

router.get('/', booksController.fetchRanking);

router.post(
	'/',
	[
		body('title').trim().isLength({ min: 1 }).withMessage("Cannot search by empty title")
	],
	booksController.findByTitle
);

router.get('/:id', booksController.detailBook);

module.exports = router;