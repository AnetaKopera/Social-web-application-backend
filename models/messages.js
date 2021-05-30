const database = require('../util/database');

module.exports = class Messages {
	constructor() {
	}

	static findAllConversationPartners(id) {
		return database.execute(`SELECT users.id, users.name, users.surname, users.photo_path, users.photo_name
		FROM users 
		JOIN messages ON messages.id_sender = users.id
		WHERE messages.id_receiver = ?
		UNION
		SELECT users.id, users.name, users.surname, users.photo_path, users.photo_name
		FROM users 
		JOIN messages ON messages.id_receiver = users.id
		WHERE messages.id_sender = ? `, [id, id]);
	}

	static findAllMessagesWithUser(id, logedUserID) {
		return database.execute(`SELECT * FROM(SELECT (TRUE) as me_sender, messages.send_date , messages.text, messages.unreaded
		FROM users 
		JOIN messages ON messages.id_sender = users.id
		WHERE messages.id_receiver = ?
		AND  messages.id_sender = ?
		UNION
		SELECT (FALSE) as me_sender,messages.send_date, messages.text, messages.unreaded
		FROM users 
		JOIN messages ON messages.id_receiver = users.id
		WHERE messages.id_sender = ?
		and messages.id_receiver=?) result 
		ORDER BY send_date`, [id, logedUserID, id, logedUserID]);
	}

	static saveMessage(message, receiver, sender) {
		return database.execute(`INSERT INTO messages(id_sender, id_receiver, text) VALUES (?,?,?)`, [sender, receiver, message]);
	}

	static deleteAllMyMessages(user_id){
		return database.execute(`DELETE FROM messages WHERE id_sender = ? OR id_receiver = ?`, [user_id, user_id]);
	}

	static markAsReaded(id_user, id_friend){
		return database.execute(`UPDATE messages SET unreaded = ? WHERE id_sender=? AND id_receiver=?`, [0, id_friend, id_user]);
	}
}