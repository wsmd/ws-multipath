const MultipathServer = require('../');

const wss = new MultipathServer({
  rejectUnhandled: false,
  port: 5000,
});

wss.on('unhandled', socket => {
  console.log('Unhandled socket!');
  socket.destroy();
});

const messagesServer = wss.createHandler({
  pathname: '/messages',
});

const notificationsServer = wss.createHandler({
  pathname: '/notifications',
});

messagesServer.on('connection', socket => {
  socket.send('hello from messages!');
  socket.on('error', () => {});
});

notificationsServer.on('connection', socket => {
  socket.send('hello from notifications!');
  socket.on('error', () => {});
});
