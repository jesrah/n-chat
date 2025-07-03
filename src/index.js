import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, "../",'index.html'));
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        // console.log('Message: ' + msg);
        io.emit('chat message', msg);
    });
    // socket.on('disconnect', () => {
    //     console.log('A user disconnected!');
    // });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});