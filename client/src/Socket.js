import React, { useEffect } from 'react';

function SocketFunctions({socket, setUserDisconnected, setIsMyTurn, setWaiting, inputPlayerName, player1, player1Id, player2Id, setPlayer2Id, player2, setPlayer2, setPlaceShip, gameId, setGameId, submitDone, setSubmitDone, setEndGame, initialGame}) {

    const [name, setName] = React.useState(true)  //1
    
    useEffect(() => {
        console.log('connected!!! id1:', socket.id);
        socket.on("connect", () => {
            console.log('connected!!! id2:', socket.id);
            initialGame();
            console.log('inputPlayerName, gameId:', inputPlayerName, gameId);
        });
        socket.on("name", (userId, inputGameId, inputPlayerName) => {
            setName({ userId, inputGameId, inputPlayerName })
        })
        socket.on("game-started", (inputGameId) => {
            console.log(`game-started2`, inputGameId)
            setEndGame("full_game");
            setSubmitDone(true);
            setPlaceShip(true);
            console.log("the game has already started")
            socket.emit(`leave-game`, inputGameId)
        })
        socket.on(`gameId`, (gameIdd) => {
            setGameId(gameIdd);
            console.log(`gameidd:`, gameIdd)
        });
        socket.on(`socket-id`, (data) => {
            setPlayer2Id(data);
        });
        socket.on(`first-turn`, (data) => {
            setIsMyTurn(true);
        });
        socket.on(`turn`, (data) => {
            setIsMyTurn(data);
        });    
        socket.on(`end-game`, (data) => {
            setIsMyTurn(false)
            setEndGame("lost")
        });
    }, []);

    useEffect(() => {
        if (player2 === "") {
            socket.emit('name', player1Id, gameId, player1)
            socket.emit(`socket-id`, gameId, player1Id)
            setGameId(name.inputGameId);
            setPlayer2Id(name.userId);
            setPlayer2(name.inputPlayerName)
            setUserDisconnected(false);
            setEndGame("");
            if (submitDone === true) {
                socket.emit(`waiting-msg`, gameId);
            }
        } else if (name.userId !== player2Id) {
            socket.emit('game-started', name.userId, name.inputGameId)
        }
    }, [name]);

    useEffect(() => {
        socket.on(`waiting-msg`, () => {
            setWaiting(true);
            if (submitDone === true) {
                socket.emit('first-turn', gameId)
            };
        })
    }, [submitDone]);

    useEffect(() => {
        socket.on(`user-disconnected`, (data) => {
            if (data === player2Id) {
                console.log("user-disconnected");
                setIsMyTurn(false);
                setEndGame("left");
                setSubmitDone(true);
                setPlaceShip(true);
            }
        })
    }, [player2Id])

    return (
        <></>
    )
}

export default SocketFunctions;