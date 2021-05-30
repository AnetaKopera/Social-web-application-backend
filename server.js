var app = require('express')();
var http = require('http').createServer(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:4200",
  }
});

const authenticationRoutes = require('./routes/authentication');
const activitiesRoutes = require('./routes/activities');
const booksRoutes = require('./routes/books');
const messagesRoutes = require('./routes/messages');
const userRoutes = require('./routes/user');
const errorController = require('../backend/controllers/error');


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', "Content-Type, Authorization, X-Requested-With");

  next();
});


app.use(bodyParser.json());
app.get('/', (req, res) => res.send('hello!'));

var users = new Map();


io.on('connection', (socket) => {

  console.log(socket.id, "connected but not loged in");
  socket.on('disconnect', (reason) => {
    users.forEach((value, key) => {
      for (let i = 0; i < value.length; i++) {
        if (value[i] == socket.id) {
          value = value.splice(i, 1);
          console.log(users);
          break;
        }
      }
    });
  });

  socket.on('new_user', (msg) => {

    if (users.has(msg)) {

      let user_sockets = [];
      let actual_user_sockets = users.get(msg);
      if (Array.isArray(actual_user_sockets)) {
        for (let i = 0; i < actual_user_sockets.length; i++) {
          user_sockets.push(actual_user_sockets[i]);
        }
      }

      user_sockets.push(socket.id);
      users.set(msg, user_sockets);

    } else {

      users.set(msg, [socket.id]);

    }
    console.log(users);
  })

  socket.on('send_new_message', (msg) => {

    if (users.has(msg.receiver)) {
      let receivers_sockets = users.get(msg.receiver);
      for (let i = 0; i < receivers_sockets.length; i++) {
        socket.to(receivers_sockets[i]).emit('new_message', { message: msg.message, receiver: msg.receiver, sender: msg.sender, information: "other" });
      }
    }
    if (users.has(msg.sender)) {
      let sender_sockets = users.get(msg.sender);
      for (let i = 0; i < sender_sockets.length; i++) {
        if (sender_sockets[i] != socket.id) {
          socket.to(sender_sockets[i]).emit('new_message', { message: msg.message, receiver: msg.receiver, sender: msg.sender, information: "me" });
        }
      }
    }
  })


  socket.on('delete', (msg) => {

    if (users.has(msg.id)) {

      let v = [];
      let tmp = users.get(msg.id);
      if (Array.isArray(tmp)) {
        for (let i = 0; i < tmp.length; i++) {
          if (socket.id != tmp[i]) { v.push(tmp[i]); }
        }
        users.set(msg.id, v);
      } else {
        users.delete(msg.id);
      }
      console.log(users);

    }

  });


  socket.on('send_new_comment', (msg) => {
    socket.broadcast.emit('new_comment', msg);
  });

  socket.on('delete_comment', (msg) => {
    socket.broadcast.emit('new_comment_deleted', msg);
  });

  socket.on('send_delete_account', (msg) => {

    users.forEach((value, key) => {
      if (key == msg.user_id) {
        for (let i = 0; i < value.length; i++) {
          if (value[i] != socket.id) {
            socket.to(value[i]).emit('profile_deleted', { user_id: msg.user_id });
          }
        }
      } else {
        for (let i = 0; i < value.length; i++) {

          socket.to(value[i]).emit('new_deleted_friend', { id_user: msg.user_id, information: "other" });

        }
      }
    });

  });


  socket.on('send_new_invitation', (msg) => {
    if (users.has(msg.friend.id)) {
      let receivers_sockets = users.get(msg.friend.id);
      for (let i = 0; i < receivers_sockets.length; i++) {
        socket.to(receivers_sockets[i]).emit('new_invitation', { user: msg.user, information: "other" });
      }
    }
    if (users.has(msg.user.id)) {
      let sender_sockets = users.get(msg.user.id);
      for (let i = 0; i < sender_sockets.length; i++) {
        if (sender_sockets[i] != socket.id) {
          socket.to(sender_sockets[i]).emit('new_invitation', { user: msg.friend, information: "me" }); //receiver
        }
      }
    }
  });

  socket.on('send_cancel_invitation', (msg) => {
    if (users.has(msg.friend_id)) {
      let receivers_sockets = users.get(msg.friend_id);
      for (let i = 0; i < receivers_sockets.length; i++) {
        socket.to(receivers_sockets[i]).emit('new_canceled_invitation', { is_user: msg.user_id, information: "other" });
      }
    }

    if (users.has(msg.user_id)) {
      let sender_sockets = users.get(msg.user_id);
      for (let i = 0; i < sender_sockets.length; i++) {
        if (sender_sockets[i] != socket.id) {
          socket.to(sender_sockets[i]).emit('new_canceled_invitation', { id_user: msg.friend_id, information: "me" });
        }
      }
    }
  });

  socket.on('send_accept_invitation', (msg) => {

    if (users.has(msg.friend.id)) {
      let receivers_sockets = users.get(msg.friend.id);
      for (let i = 0; i < receivers_sockets.length; i++) {
        socket.to(receivers_sockets[i]).emit('new_accept_invitation', { user: msg.user, information: "other" });
      }
    }

    if (users.has(msg.user.id)) {
      let sender_sockets = users.get(msg.user.id);
      for (let i = 0; i < sender_sockets.length; i++) {
        if (sender_sockets[i] != socket.id) {
          socket.to(sender_sockets[i]).emit('new_accept_invitation', { user: msg.friend, information: "me" });
        }
      }
    }
  });

  socket.on('send_decline_invitation', (msg) => {

    if (users.has(msg.friend_id)) {
      let receivers_sockets = users.get(msg.friend_id);
      for (let i = 0; i < receivers_sockets.length; i++) {
        socket.to(receivers_sockets[i]).emit('new_decline_invitation', { id_user: msg.user_id, information: "other" });
      }
    }
    if (users.has(msg.user_id)) {
      let sender_sockets = users.get(msg.user_id);
      for (let i = 0; i < sender_sockets.length; i++) {
        if (sender_sockets[i] != socket.id) {
          socket.to(sender_sockets[i]).emit('new_decline_invitation', { id_user: msg.friend_id, information: "me" });
        }
      }
    }
  });


  socket.on('send_delete_friend', (msg) => {

    if (users.has(msg.friend_id)) {
      let receivers_sockets = users.get(msg.friend_id);
      for (let i = 0; i < receivers_sockets.length; i++) {
        socket.to(receivers_sockets[i]).emit('new_deleted_friend', { id_user: msg.user_id, information: "other" });
      }
    }
    if (users.has(msg.user_id)) {
      let sender_sockets = users.get(msg.user_id);
      for (let i = 0; i < sender_sockets.length; i++) {
        if (sender_sockets[i] != socket.id) {
          socket.to(sender_sockets[i]).emit('new_deleted_friend', { id_user: msg.friend_id, information: "me" });
        }
      }
    }
  });

  socket.on('send_change_profile', (msg) => {
    users.forEach((value, key) => {
      for (let i = 0; i < value.length; i++) {
        if (value[i] != socket.id) {
          socket.to(value[i]).emit('new_change_profile', { user: msg.user });
        }
      }
    });
  });

});

app.use('/authentication',  authenticationRoutes);
app.use('/activities', activitiesRoutes);
app.use('/books', booksRoutes);
app.use('/messages', messagesRoutes);
app.use('/user', userRoutes);

app.use(errorController.get404);
app.use(errorController.get500);

http.listen(3000, () => {
  console.log('Started listening on port *:3000');
});