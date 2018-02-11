# API Reference

## Class: MultipathServer

###### Exposed by `require('ws-multipath')`.

This class represents a MultipathServer. It also extends the `EventEmitter` class.

### new MultipathServer(options)

- `options` `<Object>`
  - `autoListen` `<boolean>` Default: `true`. Indicates whether to start a server listening for connections upon creating an instance.
  - `rejectUnhandled` `<boolean>` Default: `true`. Indicates whether to reject sockets connecting to a path that is not handled by a handler.
  - `port` `number` Required. Port the server should listen to.

Returns a new server instance.

If `autoListen` is set to `false`, the server instance should have a `listen` method to start the server manually. Otherwise, this method will not be available.

If `rejectUnhandled` is set to `false`, unhandled connections will not be destroyed automatically. More on this in the `unhandled` event section.

### Event: 'unhandled'

- `socket` `<net.Socket>` Network socket that is not handled by any handlers

Emitted each time a socket is connected but is not handled by any handlers. By default those sockets will be destroyed automatically with 400 status code. If `options.rejectUnhandled` is set to false, it is then the developer responsibility to destroy those sockets.

### Event: 'connection'

- `socket` `<ws.Socket>` WebSocket that is handled by a handler
- `request` `<http.incomingMessage>` The HTTP request object
- `pathname` `<string>` The pathname name to which the socket was connected

Emitted each time a socket is connected and handled by a handler.

### Event: 'close'

Emitted when the server closes.

### server.createHandler(options)

- `options` `<Object>`
  - `path` `<string>` Required. Only accept sockets connecting this path.

`options` can also [include all properties specified](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback) by `ws` with the exception of `port`, `host`, and `server`.

If any of these three attributes is passed to `options` an error will be thrown. `port` and `host` will be inherited from the `MultipathServer` options.

Returns a new [`WebSocket.Server`](https://github.com/websockets/ws/blob/master/doc/ws.md#class-websocketserver) instance of `ws`. Please refer the the `ws` documentation for more information on this.

### server.close([callback])

- `callback` `<function>`

Stops the server from accepting new connections. The optional `callback` will be called once the `'close'` event occurs.

### server.listening

A boolean indicating whether the server is listening for connections.

