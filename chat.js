let net = require("net");

const PORT = 8124;

let allSockets = [];

let server = net
  .createServer((socket) => {
    console.log("New socket connected");

    allSockets.push(socket);

    socket.on("data", (data) => {
      console.log(`${data} from ${socket.remoteAddress} ${socket.remotePort}`);

      allSockets.forEach((conn) => {
        if (conn.remotePort != socket.remotePort)
          conn.write(`${socket.remotePort} Diz: ${data}`);
      });
    });

    socket.on("close", () => {
      console.log("Client closed connection");
    });
  })
  .listen(PORT);

server.on("listening", () => {
  console.log(`Listening on ${PORT}`);
});

server.on("error", (err) => {
  if (err.code == "EADDRINUSE") {
    console.warn("Adress in use, retrying...");

    setTimeout(() => {
      server.close();
      server.listen(PORT);
    }, 1000);
  } else {
    console.error(err);
  }
});
