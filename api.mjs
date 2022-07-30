import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";


const { PORT, HOST } = process.env

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
        // origin: 'https://amazing-malabi-e8f740.netlify.app'
        // methods: ['GET', "POST"]
    }
});


io.on('connection', (socket) => {
    console.log('a user connected, id:', socket.id);
    
    socket.on(`create-a-room`, () => {
        const gameId = Math.round(Math.random() * 1000000).toString(36);
        socket.join(gameId);
        console.log('gameId:', gameId);
        socket.emit('gameId', gameId);
    });
    socket.on(`join-a-room`, (data) => {
        socket.join(data.inputGameId);
        socket.to(data.inputGameId).emit(`name`, socket.id, data.inputGameId, data.inputPlayerName) 
        console.log('socket id', socket.id)
        console.log('joined name', data.inputPlayerName)
        console.log('join to gameId:', data.inputGameId);
    });
    socket.on("game-started", (userId, gameId) => {
        socket.to(userId).emit("game-started", gameId)
        console.log('game started:', userId, gameId )
    });
    socket.on(`leave-game`, inputGameId => {
        console.log('leave-game:', inputGameId, socket.id)
        socket.leave(inputGameId);
        socket.to(inputGameId).emit("user-disconnected", socket.id)
    })
    socket.on('name', (userId, inputGameId, inputPlayerName) => {
        console.log('name1: ', userId, inputGameId, inputPlayerName);
        if (inputGameId !== null) {
            socket.to(inputGameId).emit('name', userId, inputGameId, inputPlayerName);
        }
    });
    socket.on('socket-id', (gameId, player1Id) => {
        console.log('socket-id: ', gameId, player1Id);
        socket.to(gameId).emit('socket-id', player1Id);
    });
    socket.on('waiting-msg', gameid => {
        console.log('waiting-msg says: ', gameid);
        socket?.to(gameid).emit('waiting-msg', gameid);
    });
    socket.on('first-turn', data => {
        console.log('turn2 says: ', data);
        socket.to(data).emit('first-turn', data);
    });
    socket.on('turn', data => {
        console.log('turn1 says: ', data);
        socket?.to(data.gameId).emit('turn', data.find);
    });
    socket.on('check-hit', data => {
        console.log('data1 says: ', data);
        socket?.to(data.gameId).emit('check-hit', data.cellIndex);
    });
    socket.on('hit-result', data => {
        console.log('hit-result1 says: ', data);
        socket?.to(data.gameId).emit('hit-result', data);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id, socket.data);
        socket.except(socket.id).emit(`user-disconnected`, socket.id)
    });
    socket.on('end-game', data => {
        console.log('end-game says: ', data);
        socket?.to(data).emit('end-game', data);
    });
    socket.on("send-message", (messageData, room) => {
        console.log('send-message: ', messageData, room);
        socket?.to(room).emit("resive-message", messageData)
    });
});


server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
})