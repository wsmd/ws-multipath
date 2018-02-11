const MultipathServer = require('../lib/MultipathServer');

const PORT = 5000;

let server;
function createMultipathServer(options = {}) {
  server = new MultipathServer({ port: PORT, ...options });
}

function connectToHandler(handler) {
  return new global.WebSocket(`ws://localhost:${PORT}${handler.options.path}`);
}

afterEach(() => {
  if (server) server.close();
  server = null;
});

describe('MultipathServer', () => {
  it('auto listens by default', () => {
    createMultipathServer();
    expect(server.listening).toBeTruthy();
  });

  it('does not auto listen when options.autoListen is false', () => {
    createMultipathServer({ autoListen: false });
    expect(server.listening).toBeFalsy();
    server.listen();
    expect(server.listening).toBeTruthy();
  });

  it('creates handlers, establishes connections, and emits events', (done) => {
    const unhandledSocketSpy = jest.fn();
    const handledSocketSpy = jest.fn();

    createMultipathServer();
    server.on('unhandled', unhandledSocketSpy);
    server.on('connection', handledSocketSpy);

    const createAndTestHandler = (options) => new Promise((resolve, reject) => {
      const handler = server.createHandler(options);
      handler.on('connection', resolve);
      connectToHandler(handler);
    });

    Promise.all([
      createAndTestHandler({ path: '/foo' }),
      createAndTestHandler({ path: '/bar' }),
    ]).then(() => {
      expect(handledSocketSpy.mock.calls[0][1]).toEqual('/foo');
      expect(handledSocketSpy.mock.calls[1][1]).toEqual('/bar');
      expect(unhandledSocketSpy).not.toHaveBeenCalled();
      done();
    });
  });

  it('rejects unhandled request by default', (done) => {
    const unhandledSocketSpy = jest.fn();
    createMultipathServer();
    server.createHandler({ path: '/foo' });
    server.on('unhandled', unhandledSocketSpy);
    const client = connectToHandler({ options: { path: '/bar' } });
    client.onerror = () => {
      expect(unhandledSocketSpy).toHaveBeenCalled();
      done();
    };
  });

  it('does not reject unhandled sockets when options.rejectUnhandled is false', (done) => {
    createMultipathServer({ rejectUnhandled: false });

    const client = connectToHandler({ options: { path: '/bar' } });
    const clientErrorSpy = jest.fn();
    client.onerror = clientErrorSpy;

    server.createHandler({ path: '/foo' });
    server.on('unhandled', (socket) => {
      expect(clientErrorSpy).not.toHaveBeenCalled();
      socket.destroy();
      done();
    });
  });

  it('throws when creating duplicate handlers', () => {
    createMultipathServer();
    server.createHandler({ path: '/foo' });
    expect(() => {
      server.createHandler({ path: '/foo' });
    }).toThrow(/already exists/);
  });

  it('throws when passing inavlid server options', () => {
    expect(() => new MultipathServer()).toThrow(/options/);
    expect(() => new MultipathServer({})).toThrow(/port/);
  });

  it('throws when passing invalid handler options', () => {
    createMultipathServer();
    expect(() => server.createHandler()).toThrow();
    expect(() => server.createHandler({})).toThrow();
    expect(() => server.createHandler({ path: 100 })).toThrow();

    const errorRegExp = /port|host|server/;
    expect(() => {
      server.createHandler({ path: '/foo', port: 4000 });
    }).toThrow(errorRegExp);
    expect(() => {
      server.createHandler({ path: '/foo', host: '1.1.1.1' });
    }).toThrow(errorRegExp);
    expect(() => {
      server.createHandler({ path: '/foo', server: {} });
    }).toThrow(errorRegExp);
  });
});
