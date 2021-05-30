const database = require('../util/database');

module.exports = class User {
	constructor(name, surname, description, email, password, photo_path, photo_name) {
		this.name = name;
		this.surname = surname;
		this.description = description;
		this.email = email;
		this.password = password;
		this.photo_path = photo_path;
		this.photo_name = photo_name;
	}

	static find(email) {
		return database.execute('SELECT * FROM users WHERE email = ?', [email]);
	}

	static findById(id) {
		return database.execute('SELECT * FROM users WHERE id = ?', [id]);
	}

	static save(user) {
		if (user.description.trim().length > 1) {
			return database.execute(
				'INSERT INTO users (name, surname, description, email, password) VALUES (?,?,?,?,?)', [user.name, user.surname, user.description, user.email, user.password]
			);
		}
		else {
			return database.execute(
				'INSERT INTO users (name, surname, email,password) VALUES (?,?,?,?)', [user.name, user.surname, user.email, user.password]
			);
		}
	}

	static getFriends(id) {
		return database.execute(`SELECT users.id, users.name, users.surname, users.photo_path, users.photo_name
			FROM users 
			JOIN friends ON friends.id_first_friend = users.id
			WHERE friends.id_second_friend= ?
			UNION
			SELECT users.id, users.name, users.surname, users.photo_path, users.photo_name
			FROM users 
			JOIN friends ON friends.id_second_friend = users.id
			WHERE friends.id_first_friend =?`, [id, id]);
	}

	static getMatchingStrangers(user_id, stranger) {
		let ready_stranger = "%" + stranger.toLowerCase() + "%";

		return database.execute(`SELECT * from users WHERE
		( LOWER(name) LIKE ? OR LOWER(surname) LIKE ? OR LOWER(CONCAT(name," ", surname)) LIKE ?)
		AND id NOT IN (SELECT users.id
		FROM users 
		JOIN friends ON friends.id_first_friend = users.id
		WHERE friends.id_second_friend= ?
		UNION
		SELECT users.id
		FROM users 
		JOIN friends ON friends.id_second_friend = users.id
		WHERE friends.id_first_friend =?)
		AND id NOT IN(?)
		AND id NOT IN(
		SELECT id_sender
		FROM invitations 
		WHERE id_receiver= ?
		UNION
		SELECT id_receiver
		FROM invitations 
		WHERE id_sender =?
		)`, [ready_stranger, ready_stranger, ready_stranger, user_id, user_id, user_id, user_id, user_id]);
	}

	static deleteAllMyFriends(id) {
		return database.execute(`DELETE FROM friends 
			WHERE id_second_friend = ?
			OR id_first_friend = ?`, [id, id]);
	}

	static deleteAllMyInvitations(id) {
		return database.execute(`DELETE FROM invitations 
			WHERE id_sender = ?
			OR id_receiver = ?`, [id, id]);
	}

	static updateDescription(user_id, description) {
		return database.execute(`UPDATE users SET description = ? WHERE id = ?`, [description, user_id]);
	}

	static deleteDescription(user_id) {
		return database.execute(`UPDATE users SET description = NULL WHERE id = ?`, [user_id]);
	}

	static updatePassword(id, password) {
		return database.execute(`UPDATE users SET password = ? WHERE id = ?`, [password, id]);
	}

	static updateName(user_id, name) {
		return database.execute(`UPDATE users SET name = ? WHERE id = ?`, [name, user_id]);
	}

	static updateSurname(user_id, surname) {
		return database.execute(`UPDATE users SET surname = ? WHERE id = ?`, [surname, user_id]);
	}

	static updateNameSurname(user_id, name, surname) {
		return database.execute(`UPDATE users SET name = ?, surname = ? WHERE id = ?`, [name, surname, user_id]);
	}

	static updateEmail(user_id, email) {
		return database.execute(`UPDATE users SET email = ? WHERE id = ?`, [email, user_id]);
	}

	static updatePicture(photo_path, photo_name, user_id) {
		photo_path = 'http://localhost/social-app/images/users/';
		return database.execute(`UPDATE users SET photo_path = ?, photo_name = ? WHERE id = ?`, [photo_path, photo_name, user_id]);
	}

	static deletePicture(user_id) {
		return database.execute(`UPDATE users SET photo_path = ?, photo_name = ? WHERE id = ?`, [null, null, user_id]);
	}

	static inviteFriend(user_id, friend_id) {
		return database.execute('INSERT INTO invitations (id_sender, id_receiver) VALUES (?,?)', [user_id, friend_id]);
	}

	static deleteInvitation(user_id, friend_id) {
		return database.execute(`DELETE FROM invitations WHERE (id_sender = ? AND id_receiver = ? )
		OR (id_sender = ? AND id_receiver = ?)`, [user_id, friend_id, friend_id, user_id]);
	}

	static addToFriends(user_id, friend_id) {
		return database.execute('INSERT INTO friends (id_first_friend, id_second_friend) VALUES (?,?)', [user_id, friend_id]);
	}

	static deleteFriend(user_id, friend_id) {
		return database.execute(`DELETE FROM friends WHERE (id_first_friend = ? AND id_second_friend = ? )
		OR (id_second_friend = ? AND id_first_friend = ?)`, [user_id, friend_id, user_id, friend_id]);
	}

	static deleteAccount(user_id) {
		return database.execute('DELETE FROM users WHERE id = ?', [user_id]);
	}

	static iInvitedList(user_id) {
		return database.execute(`SELECT * from users
		JOIN invitations ON users.id = invitations.id_receiver
		WHERE invitations.id_sender = ?`, [user_id]);
	}

	static invitedMeList(user_id) {
		return database.execute(`SELECT * from users
		JOIN invitations ON users.id = invitations.id_sender
		WHERE invitations.id_receiver = ?`, [user_id]);
	}

	static deleteMessagesWithUser(user_id, friend_id) {
		return database.execute(`DELETE FROM messages WHERE (id_sender = ? AND id_receiver = ? )
		OR (id_receiver = ? AND id_sender = ?)`, [user_id, friend_id, user_id, friend_id]);
	}

	static markAsReaded(user_id) {
		return database.execute(`UPDATE invitations SET unreaded = ?  WHERE id_receiver = ?`, [0, user_id]);
	}

	static markOneInvitationAsReaded(user_id, friend_id) {
		return database.execute(`UPDATE invitations SET unreaded = ?  WHERE id_receiver = ? AND id_sender=?`, [0, user_id, friend_id]);
	}
}

