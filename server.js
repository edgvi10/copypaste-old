import express, { Express, Request, Response } from 'express';
import * as http from 'http';
import next from 'next';
import{ Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async() => {
    const app = express();
    const server = http.createServer(app);
    const io = new Server();
    io.attach(server);

    app.get('/hello', async (_, res) => {
        res.send('Hello World')
    });

    io.on('connection', (socket) => {
        console.log('connection');
        socket.emit('status', 'Hello from Socket.io');

        socket.on('disconnect', () => {
            console.log('client disconnected');
        })
    });

    app.all('*', (req, res) => nextHandler(req, res));

    server.listen(3001, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});