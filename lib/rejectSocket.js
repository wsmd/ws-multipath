'use-strict';

const { STATUS_CODES } = require('http');

const STATUS_CODE = 400;
const STATUS_DESCRIPTION = STATUS_CODES[STATUS_CODE];

// Useful resource: A Practical Guide to Writing Clients and Servers
// http://www.jmarshall.com/easy/http/

/**
 * Closing the socket connection with a 400 response
 * @param {net.Socket} socket The socket of the upgrade request
 */
function rejectSocket(socket) {
  // istanbul ignore else (net.Socket is also a duplex stream)
  if (socket.writable) {
    socket.write([
      `HTTP/1.0 ${STATUS_CODE} ${STATUS_DESCRIPTION}`,
      'Connection: close',
      'Content-Type: text/html',
      `Content-Length: ${Buffer.byteLength(STATUS_DESCRIPTION)}`,
      '',
      STATUS_DESCRIPTION,
    ].join('\r\n'));
  }
  socket.destroy();
}

module.exports = {
  rejectSocket,
};
