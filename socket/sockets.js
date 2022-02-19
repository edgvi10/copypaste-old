import { Server } from "socket.io";

const io = new Server({ cors: { origin: '*' } });

io.on("connection", (socket) => {
  console.log('socket connection', socket.id)

  socket.on("join room", (slug) => {
    socket.join(slug)
    console.log("room joined", socket.id)
  })

  socket.on("copypaste", (data) => {
    io.to(data[0]).emit("copypaste", data[1].content)
  })
});

io.listen(3000);