const database = require('../util/database');

module.exports = class Activity {
	constructor(id, id_book, description, id_type_of_activity, id_owner, date, visibility) {
		this.id = id;
		this.id_book = id_book;
		this.description = description;
		this.id_type_of_activity = id_type_of_activity;
		this.id_owner = id_owner;
		this.date = date;
		this.visibility = visibility;
	}

	static fetchPublicActivities() {
		return database.execute(`
		SELECT activities.id,
		books.id AS book_id, CONCAT(authors.name, ' ', authors.surname) AS book_author, books.title AS book_title,books.photo_path AS book_photo_path, books.photo_name AS book_photo_name,
		users.id AS owner_id, users.name AS owner_name, users.surname AS owner_surname, users.photo_path AS owner_photo_path, users.photo_name AS owner_photo_name,
		types_of_activity.id AS type_of_activity_id, types_of_activity.label AS type_of_activity_label, types_of_activity.icon_path AS type_of_activity_icon_path, types_of_activity.icon_name AS type_of_activity_icon_name,
		activities.description,  activities.grade, timestamp(activities.date) AS date, activities.visibility, DATE_FORMAT(activities.date,'%d-%m-%Y %H:%i') AS date
		FROM activities 
		JOIN books ON activities.id_book = books.id 
		JOIN authors ON books.id_author = authors.id
		JOIN users ON activities.id_owner = users.id 
		JOIN types_of_activity ON activities.id_type_of_activity = types_of_activity.id 
		WHERE visibility="public"
		AND DATE(activities.date)> DATE_SUB(NOW() , INTERVAL 1 MONTH)
		ORDER BY timestamp(activities.date) DESC`);
	}

	static fetchPublicActivitiesUnlimited() {
		return database.execute(`
		SELECT activities.id,
		books.id AS book_id, CONCAT(authors.name, ' ', authors.surname) AS book_author, books.title AS book_title,books.photo_path AS book_photo_path, books.photo_name AS book_photo_name,
		users.id AS owner_id, users.name AS owner_name, users.surname AS owner_surname, users.photo_path AS owner_photo_path, users.photo_name AS owner_photo_name,
		types_of_activity.id AS type_of_activity_id, types_of_activity.label AS type_of_activity_label, types_of_activity.icon_path AS type_of_activity_icon_path, types_of_activity.icon_name AS type_of_activity_icon_name,
		activities.description,  activities.grade, timestamp(activities.date) AS date, activities.visibility, DATE_FORMAT(activities.date,'%d-%m-%Y %H:%i') AS date
		FROM activities 
		JOIN books ON activities.id_book = books.id 
		JOIN authors ON books.id_author = authors.id
		JOIN users ON activities.id_owner = users.id 
		JOIN types_of_activity ON activities.id_type_of_activity = types_of_activity.id 
		WHERE visibility="public"
		ORDER BY timestamp(activities.date) DESC`);
	}

	static fetchPublicActivitiesForUser(id_user) {
		return database.execute(`
		SELECT activities.id,
		books.id AS book_id,  CONCAT(authors.name, ' ', authors.surname) AS book_author, books.title AS book_title,books.photo_path AS book_photo_path, books.photo_name AS book_photo_name,
		users.id AS owner_id, users.name AS owner_name, users.surname AS owner_surname, users.photo_path AS owner_photo_path, users.photo_name AS owner_photo_name,
		types_of_activity.id AS type_of_activity_id, types_of_activity.label AS type_of_activity_label, types_of_activity.icon_path AS type_of_activity_icon_path, types_of_activity.icon_name AS type_of_activity_icon_name,
		activities.description,  activities.grade, activities.date, activities.visibility, DATE_FORMAT(activities.date,'%d-%m-%Y %H:%i') AS date
		FROM activities 
		JOIN books ON activities.id_book = books.id 
		JOIN authors ON books.id_author = authors.id
		JOIN users ON activities.id_owner = users.id 
		JOIN types_of_activity ON activities.id_type_of_activity = types_of_activity.id 
		WHERE visibility="public"
		AND users.id = ?
		AND DATE(activities.date)> DATE_SUB(NOW() , INTERVAL 1 MONTH)
		ORDER BY date DESC`, [id_user]);
	}

	static fetchPublicActivitiesForUserUnlimited(id_user) {
		return database.execute(`
		SELECT activities.id,
		books.id AS book_id,  CONCAT(authors.name, ' ', authors.surname) AS book_author, books.title AS book_title,books.photo_path AS book_photo_path, books.photo_name AS book_photo_name,
		users.id AS owner_id, users.name AS owner_name, users.surname AS owner_surname, users.photo_path AS owner_photo_path, users.photo_name AS owner_photo_name,
		types_of_activity.id AS type_of_activity_id, types_of_activity.label AS type_of_activity_label, types_of_activity.icon_path AS type_of_activity_icon_path, types_of_activity.icon_name AS type_of_activity_icon_name,
		activities.description,  activities.grade, activities.date, activities.visibility, DATE_FORMAT(activities.date,'%d-%m-%Y %H:%i') AS date
		FROM activities 
		JOIN books ON activities.id_book = books.id 
		JOIN authors ON books.id_author = authors.id
		JOIN users ON activities.id_owner = users.id 
		JOIN types_of_activity ON activities.id_type_of_activity = types_of_activity.id 
		WHERE visibility="public"
		AND users.id = ?
		ORDER BY date DESC`, [id_user]);
	}

	static fetchAllActivitiesForUser(id_user) {
		return database.execute(`
		SELECT activities.id,
		books.id AS book_id,  CONCAT(authors.name, ' ', authors.surname) AS book_author, books.title AS book_title,books.photo_path AS book_photo_path, books.photo_name AS book_photo_name,
		users.id AS owner_id, users.name AS owner_name, users.surname AS owner_surname, users.photo_path AS owner_photo_path, users.photo_name AS owner_photo_name,
		types_of_activity.id AS type_of_activity_id, types_of_activity.label AS type_of_activity_label, types_of_activity.icon_path AS type_of_activity_icon_path, types_of_activity.icon_name AS type_of_activity_icon_name,
		activities.description, activities.grade, activities.date, activities.visibility, DATE_FORMAT(activities.date,'%d-%m-%Y %H:%i') AS date
		FROM activities 
		JOIN books ON activities.id_book = books.id 
		JOIN authors ON books.id_author = authors.id
		JOIN users ON activities.id_owner = users.id 
		JOIN types_of_activity ON activities.id_type_of_activity = types_of_activity.id 
		WHERE users.id = ?
		AND DATE(activities.date)> DATE_SUB(NOW() , INTERVAL 1 MONTH)
		ORDER BY date DESC`, [id_user]);
	}

	static fetchAllActivitiesForUserUnlimited(id_user) {
		return database.execute(`
		SELECT activities.id,
		books.id AS book_id,  CONCAT(authors.name, ' ', authors.surname) AS book_author, books.title AS book_title,books.photo_path AS book_photo_path, books.photo_name AS book_photo_name,
		users.id AS owner_id, users.name AS owner_name, users.surname AS owner_surname, users.photo_path AS owner_photo_path, users.photo_name AS owner_photo_name,
		types_of_activity.id AS type_of_activity_id, types_of_activity.label AS type_of_activity_label, types_of_activity.icon_path AS type_of_activity_icon_path, types_of_activity.icon_name AS type_of_activity_icon_name,
		activities.description, activities.grade, activities.date, activities.visibility, DATE_FORMAT(activities.date,'%d-%m-%Y %H:%i') AS date
		FROM activities 
		JOIN books ON activities.id_book = books.id 
		JOIN authors ON books.id_author = authors.id
		JOIN users ON activities.id_owner = users.id 
		JOIN types_of_activity ON activities.id_type_of_activity = types_of_activity.id 
		WHERE users.id = ?
		ORDER BY date DESC`, [id_user]);
	}

	static fetchFriendActivities(idFriend) {
		return database.execute(`
		SELECT activities.id,
		books.id AS book_id, CONCAT(authors.name, ' ', authors.surname) AS book_author, books.title AS book_title,books.photo_path AS book_photo_path, books.photo_name AS book_photo_name,
		users.id AS owner_id, users.name AS owner_name, users.surname AS owner_surname, users.photo_path AS owner_photo_path, users.photo_name AS owner_photo_name,
		types_of_activity.id AS type_of_activity_id, types_of_activity.label AS type_of_activity_label, types_of_activity.icon_path AS type_of_activity_icon_path, types_of_activity.icon_name AS type_of_activity_icon_name,
		activities.description, activities.grade, activities.date, activities.visibility, DATE_FORMAT(activities.date,'%d-%m-%Y %H:%i') AS date
		FROM activities 
		JOIN books ON activities.id_book = books.id 
		JOIN authors ON books.id_author = authors.id
		JOIN users ON activities.id_owner = users.id 
		JOIN types_of_activity ON activities.id_type_of_activity = types_of_activity.id 
		WHERE users.id = ? AND visibility="friends"
		AND DATE(activities.date)> DATE_SUB(NOW() , INTERVAL 1 MONTH)
		ORDER BY date DESC`, [idFriend]);
	}

	static fetchFriendActivitiesUnlimited(idFriend) {
		return database.execute(`
		SELECT activities.id,
		books.id AS book_id, CONCAT(authors.name, ' ', authors.surname) AS book_author, books.title AS book_title,books.photo_path AS book_photo_path, books.photo_name AS book_photo_name,
		users.id AS owner_id, users.name AS owner_name, users.surname AS owner_surname, users.photo_path AS owner_photo_path, users.photo_name AS owner_photo_name,
		types_of_activity.id AS type_of_activity_id, types_of_activity.label AS type_of_activity_label, types_of_activity.icon_path AS type_of_activity_icon_path, types_of_activity.icon_name AS type_of_activity_icon_name,
		activities.description, activities.grade, activities.date, activities.visibility, DATE_FORMAT(activities.date,'%d-%m-%Y %H:%i') AS date
		FROM activities 
		JOIN books ON activities.id_book = books.id 
		JOIN authors ON books.id_author = authors.id
		JOIN users ON activities.id_owner = users.id 
		JOIN types_of_activity ON activities.id_type_of_activity = types_of_activity.id 
		WHERE users.id = ? AND visibility="friends"
		ORDER BY date DESC`, [idFriend]);
	}

	static getActivityDetails(id) {
		return database.execute(`
		SELECT activities.id,
		books.id AS book_id, CONCAT(authors.name, ' ', authors.surname) AS book_author, books.title AS book_title,books.photo_path AS book_photo_path, books.photo_name AS book_photo_name,
		users.id AS owner_id, users.name AS owner_name, users.surname AS owner_surname, users.photo_path AS owner_photo_path, users.photo_name AS owner_photo_name,
		types_of_activity.id AS type_of_activity_id, types_of_activity.label AS type_of_activity_label, types_of_activity.icon_path AS type_of_activity_icon_path, types_of_activity.icon_name AS type_of_activity_icon_name,
		activities.description, activities.grade, activities.date, activities.visibility, DATE_FORMAT(activities.date,'%d-%m-%Y %H:%i') AS date
		FROM activities 
		JOIN books ON activities.id_book = books.id 
		JOIN authors ON books.id_author = authors.id
		JOIN users ON activities.id_owner = users.id 
		JOIN types_of_activity ON activities.id_type_of_activity = types_of_activity.id 
		WHERE activities.id = ?`, [id]);
	}

	static save(activity) {
		return database.execute(
			'INSERT INTO activities (id_book, description, id_type_of_activity, id_owner,  visibility) VALUES (?,?, ?, ?, ?)',
			[activity.id_book, activity.description, activity.id_type_of_activity, activity.id_owner, activity.visibility]
		);
	}
	static saveWithGrade(activity) {
		return database.execute(
			'INSERT INTO activities (id_book, description, id_type_of_activity, grade, id_owner,  visibility) VALUES (?,?, ?, ?, ?, ?)',
			[activity.id_book, activity.description, activity.id_type_of_activity, activity.grade, activity.id_owner, activity.visibility]
		);
	}

	static reportActivity(id) {
		return database.execute('INSERT INTO reports_activities (reviewed, id_activity) VALUES (0, ?)', [id]);
	}

	static delete(id) {
		return database.execute('DELETE FROM activities WHERE id= ?', [id]);
	}

	static deleteComments(id) {
		return database.execute('DELETE FROM comments WHERE id_activity = ?', [id]);
	}

	static deleteComment(id) {
		return database.execute('DELETE FROM comments WHERE id= ?', [id]);
	}

	static deleteAllUserComments(id) {
		return database.execute('DELETE FROM comments WHERE id_owner= ?', [id]);
	}

	static getComments(idActivity) {
		return database.execute(`SELECT comments.id, comments.text,  DATE_FORMAT(comments.date,'%d-%m-%Y %H:%i') AS date,
		users.id AS owner_id, users.name AS owner_name, users.surname AS owner_surname, users.photo_path AS owner_photo_path, users.photo_name AS owner_photo_name
		FROM comments
		JOIN users ON users.id = comments.id_owner
		WHERE comments.id_activity = ?
		ORDER BY comments.date DESC`, [idActivity]);
	}

	static getAllUserComments(id) {
		return database.execute('SELECT * FROM comments WHERE id_owner= ?', [id]);
	}

	static saveComment(idOwner, idActivity, comment) {
		return database.execute('INSERT INTO comments (id_owner, id_activity, text) VALUES (?,?, ?)',
			[idOwner, idActivity, comment]);
	}

	static reportComment(id) {
		return database.execute('INSERT INTO reports_comments (reviewed, id_comment) VALUES (0, ?)', [id]);
	}

	static getActivityTypes() {
		return database.execute(`SELECT id, label, icon_path, icon_name FROM types_of_activity`);
	}

	static deleteReportComment(comment_id) {
		return database.execute('DELETE FROM reports_comments WHERE id_comment=?', [comment_id]);
	}

	static deleteReportAcctivity(activity_id) {
		return database.execute('DELETE FROM reports_activities WHERE id_activity=?', [activity_id]);
	}

}

