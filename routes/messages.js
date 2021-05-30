const express = require('express');

const router = express.Router();

const messagesController = require('../controllers/messages');

router.get('/conversationlist/:id', messagesController.friendsList);

router.post('/conversationwith/', messagesController.messages);

router.post('/messages_readed/', messagesController.markAsReaded);

router.post('/', messagesController.saveMessage);

module.exports = router;