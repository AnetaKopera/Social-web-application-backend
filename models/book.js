const database = require('../util/database');

module.exports = class Book {
	constructor(title, author_name, author_surname, description, publication_date, photo_path, photo_name, activities, reactions, score) {
		this.title = title;
		this.author_name = author_name;
		this.author_surname = author_surname;
		this.description = description;
		this.publication_date = publication_date;
		this.photo_path = photo_path;
		this.photo_name = photo_name;
		this.activities = activities;
		this.reactions= reactions;
		this.score = score;
	}

	static findByTitle(title) {
		title = '%' + title.trim().toLowerCase() + '%';
		return database.execute(`SELECT books.id, books.title, books.description, books.publication_date, 
		books.photo_path, books.photo_name, authors.name AS author_name, authors.surname 
		AS author_surname FROM books JOIN authors ON books.id_author =  authors.id WHERE LOWER(title) LIKE ? ORDER BY books.title`, [title]);
	}

	static fetchRanking() {
		return database.execute(`SELECT t.*, t2.*, ROUND((t.grade/t.reactions),1) as score
		FROM  (SELECT books.id, books.title, books.description, books.publication_date, books.photo_path,
		books.photo_name, authors.name AS author_name, authors.surname AS author_surname ,
		count(*) as reactions,
		sum(activities.grade) as grade
		FROM books 
		JOIN authors ON books.id_author =  authors.id
		JOIN activities ON books.id= activities.id_book
		WHERE grade IS NOT NULL
		GROUP BY books.id
		) AS t, 
		(SELECT books.id, count(*) as activities
		FROM books 
		JOIN authors ON books.id_author =  authors.id
		JOIN activities ON books.id= activities.id_book
		GROUP BY books.id) AS t2
        WHERE t.id = t2.id
		ORDER BY score DESC, t.title
		LIMIT 10`);
	}

	static getBook(id) {
		return database.execute(`SELECT t.*, t2.*, ROUND((t.grade/t.reactions),1) as score
		FROM  (SELECT books.id, books.title, books.description, books.publication_date, books.photo_path,
		books.photo_name, authors.name AS author_name, authors.surname AS author_surname ,
		count(*) as reactions,
		sum(activities.grade) as grade
		FROM books 
		JOIN authors ON books.id_author =  authors.id
		JOIN activities ON books.id= activities.id_book
		WHERE grade IS NOT NULL
		AND books.id = ?
		) AS t, 
		(SELECT count(*) as activities
		FROM books 
		JOIN authors ON books.id_author =  authors.id
		JOIN activities ON books.id= activities.id_book
		WHERE books.id = ?) AS t2`, [id, id]);
	}


}

