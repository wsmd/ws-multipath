const net = require('net');
const Mitm = require('mitm');
const httpHeaders = require('http-headers');
const { rejectSocket } = require('../lib/rejectSocket');

// Intercepting outgoing TCP connections
const mitm = Mitm();
beforeAll(() => mitm.on('connection', rejectSocket));
afterAll(() => mitm.disable());

describe('rejectSocket', () => {
  it('closes a socket connection with 400 status code', (done) => {
    const socket = net.createConnection(80);
    socket.on('data', (data) => {
      expect(httpHeaders(data).statusCode).toBe(400);
      // if rejectSocket fails to close the connection, the test will timeout
      // and eventually fail
      socket.on('close', done);
    });
  });
});
