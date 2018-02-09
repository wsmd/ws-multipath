const MultipathServer = require('../');

const wss = new MultipathServer({
  rejectUnhandled: false,
  port: 5000,
});

wss.on('connection', (ws, pathname) => {
  console.log(`Received a ${ws.constructor.name} on`, pathname);
});

wss.on('unhandled', socket => {
  console.log('Unhandled socket!');
  socket.destroy();
});

const messages = wss.createHandler({ path: '/messages' });
const notifications = wss.createHandler({ path: '/notifications' });

messages.on('connection', socket => {
  socket.send('hello from messages!');
  socket.on('error', () => {});
});

notifications.on('connection', socket => {
  socket.send('hello from notifications!');
  socket.on('error', () => {});
});
