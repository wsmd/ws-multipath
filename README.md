[![Build Status](https://travis-ci.org/wsmd/ws-multipath.svg?branch=master)](https://travis-ci.org/wsmd/ws-multipath)
[![Coverage Status](https://coveralls.io/repos/github/wsmd/ws-multipath/badge.svg?branch=master)](https://coveralls.io/github/wsmd/ws-multipath?branch=master)
[![License](https://img.shields.io/github/license/wsmd/ws-multipath.svg)](https://github.com/wsmd/ws-multipath/blob/master/LICENSE)

<img src="https://user-images.githubusercontent.com/2100222/36067365-6f2f344c-0e89-11e8-87fa-94513973b6d3.png" width="88" alt="logo" />

# ws-multipath

`ws-multipath` is a wrapper around [`websockets/ws`](https://github.com/websockets/ws/) that provides the ability to attach multiple WebSocket servers to one shared HTTP server to handle multiple paths.

## Why?

Have you ever wanted to serve multiple WebSocket endpoints using a single port/server. You might have tried something that looked a little bit like this:

```js
const { Server } = require('ws');

const PORT = 1234;

const server1 = new Server({ port: PORT, path:'/notifications' });
const server2 = new Server({ port: PORT, path:'/messages' });
```

Soon after, you realize that it's not possible. Not easily, at least.

Having multiple WebSocket servers on the same port can be a messy process. So I decided to write `ws-multipath` in hopes of simplifying this task.

## How?

In order to have multiple WebSockets server running on the same port, a developer would have to create multiple "serverless" `WebSocket.Server`s (using the `noServer` option) and utilize one shared HTTP server that delegates requests to the proper WebSocket server.

Sounds complicated, right? That's all what `ws-multipath` does!

## Example

```js
const MultipathServer = require('ws-multipath');

const server = new MultipathServer({ port: 1234 });

const foo = server.createHandler({ path: '/foo' });
const bar = server.createHandler({ path: '/bar' });

// handle sockets connecting to ws://localhost:1234/foo
foo.on('connection', (ws) => {
  ws.send('hello from /foo!');
});

// handle sockets connecting to ws://localhost:1234/bar
bar.on('connection', (ws) => {
  ws.send('hello from /bar!');
});
```

## Documentation

> _Please note that this is experimental and under active development. Therefore, it may have numerous bugs, and the API is subject to change._

See [`/docs/api.md`](./docs/api.md) for full API documentation.

## Installation

To install `ws-multipath`, you must have `ws` installed as well.

```bash
# ws is a peer-dependency of ws-multipath

# using npm
npm install --save ws ws-multipath

# using yarn
yarn add ws ws-multipath
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## License

MIT
