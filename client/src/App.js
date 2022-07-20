import React, { useEffect } from 'react';
import "./App.css";
import io from 'socket.io-client';
import Chat from "./Chat";
import IdheadLine from "./IdheadLine";
import StartPage from "./StartPage";
import HostBoard from "./HostBoard";
import SocketFunctions from "./Socket";
import OpponentBoard from "./OpponentBoard";

function createTable(numOfCalls) {
  let table = [];
  for (let key = 0; key < numOfCalls; key++) {
    table.push({
      key,
      className: '',
      selected: ''
    });
  };
  return table;
};

const socket = io("ws://localhost:3030");
// const socket = io("https://battleship-app-server.herokuapp.com");

const boardRow = createTable(10);
const boardColumn = createTable(10);
const initialShipLegend = [
  { key: 1, shipId: 41, length: 4, numOfHit: 0 },
  { key: 2, shipId: 31, length: 3, numOfHit: 0 },
  { key: 3, shipId: 32, length: 3, numOfHit: 0 },
  { key: 4, shipId: 21, length: 2, numOfHit: 0 },
  { key: 5, shipId: 22, length: 2, numOfHit: 0 },
  { key: 6, shipId: 23, length: 2, numOfHit: 0 },
  { key: 7, shipId: 11, length: 1, numOfHit: 0 },
  { key: 8, shipId: 12, length: 1, numOfHit: 0 },
  { key: 9, shipId: 13, length: 1, numOfHit: 0 },
  { key: 10, shipId: 14, length: 1, numOfHit: 0 },
];


function App() {

  const [thinkingCircle, setThinkingCircle] = React.useState(false) //2
  const [endGame, setEndGame] = React.useState(""); //3
  const [inputGameId, setInputGameId] = React.useState(""); //6
  const [gameId, setGameId] = React.useState(null); //7
  const [waiting, setWaiting] = React.useState(false);  //8
  const [isMyTurn, setIsMyTurn] = React.useState(false);  //9
  const [userDisconnected, setUserDisconnected] = React.useState(true); //10
  const [inputPlayerName, setInputPlayerName] = React.useState(""); // the player name in the input 11
  const [player1, setPlayer1] = React.useState("");  // player1 name  12
  const [player2, setPlayer2] = React.useState("");  // player2 name  13
  const [player1Id, setPlayer1Id] = React.useState(""); //14
  const [player2Id, setPlayer2Id] = React.useState(""); //15
  const [placeShip, setPlaceShip] = React.useState(false); // check if the player end to put all the ships  20
  const [submitDone, setSubmitDone] = React.useState(false); // check if the player end to put all the ships  21

  function initialGame() {  // מאתחל את המשחק
    setPlayer2("");
    setPlaceShip(false);
    setWaiting(false);
    setPlayer1("");
    setGameId(null);
    setIsMyTurn(false);
    setSubmitDone(false);
    setEndGame("");
    setPlayer2Id("");
    setInputGameId("");
    setInputPlayerName("");
    setUserDisconnected(true);
    socket.emit(`leave-game`, gameId)
  };

  return (
    <>
      <SocketFunctions
        socket={socket}
        endGame={endGame}
        setUserDisconnected={setUserDisconnected}
        setIsMyTurn={setIsMyTurn}
        setWaiting={setWaiting}
        inputPlayerName={inputPlayerName}
        player1={player1}
        player1Id={player1Id}
        player2Id={player2Id}
        setPlayer2Id={setPlayer2Id}
        player2={player2}
        setPlayer2={setPlayer2}
        setPlaceShip={setPlaceShip}
        gameId={gameId}
        setGameId={setGameId}
        submitDone={submitDone}
        setSubmitDone={setSubmitDone}
        setEndGame={setEndGame}
        initialGame={initialGame}
      />
      <div className="circle_container">
        {thinkingCircle && <div className="circle"></div>}
        <h1 className="game_title">BattleShip Game</h1>
        {gameId &&
          <IdheadLine
            gameId={gameId}
            initialGame={initialGame}
          />
        }
        {(!player1 || !gameId) &&
          <StartPage
            inputPlayerName={inputPlayerName}
            inputGameId={inputGameId}
            setPlayer1Id={setPlayer1Id}
            setPlayer1={setPlayer1}
            setInputPlayerName={setInputPlayerName}
            setInputGameId={setInputGameId}
            socket={socket}
          />
        }
        {(player1 && gameId) &&
          <div>
            <Chat
              socket={socket}
              room={gameId}
              playerName={player1}
              player2Name={player2}
              endGame={endGame}
            />
            <div className="players_title">
              <h2 className="player_title host_name_color">{player1}</h2>
              <h2 className="player_title opponent_name_color">{player2}</h2>
            </div>
            <div className="gameContainer">
              <HostBoard
                endGame={endGame}
                socket={socket}
                placeShip={placeShip}
                setPlaceShip={setPlaceShip}
                submitDone={submitDone}
                setSubmitDone={setSubmitDone}
                boardRow={boardRow}
                boardColumn={boardColumn}
                createTable={createTable}
                gameId={gameId}
                setIsMyTurn={setIsMyTurn}
                initialShipLegend={initialShipLegend}
              />
              <div className="player_game_board_order">
                {(player2 && !userDisconnected && submitDone && waiting) ?
                  <OpponentBoard
                    socket={socket}
                    gameId={gameId}
                    endGame={endGame}
                    setEndGame={setEndGame}
                    inputPlayerName={inputPlayerName}
                    boardRow={boardRow}
                    boardColumn={boardColumn}
                    isMyTurn={isMyTurn}
                    setIsMyTurn={setIsMyTurn}
                    createTable={createTable}
                    initialShipLegend={initialShipLegend}
                    setThinkingCircle={setThinkingCircle}
                  />
                  :
                  ((waiting && !userDisconnected) ?
                    <div className="player_game_board player_game_board_msg waiting_animation">{player2} has finished and waiting for you</div>
                    : (player2 ? <div className="player_game_board player_game_board_msg waiting_animation">Waiting for {player2}, he's not ready yet</div>
                      : <div className="player_game_board player_game_board_msg waiting_animation">Waiting for someone to join in</div>))
                }
                {submitDone &&
                  ((player2 && isMyTurn && waiting)
                    ? <div className="your_turn_colors witch_turn_display" >It's your turn</div>
                    : ((player2 && !isMyTurn && waiting) &&
                      <div className="opponent_turn_colors witch_turn_display" >It's {player2}'s turn</div>)
                  )
                }

              </div>
            </div>
          </div>
        }
        {endGame !== "" &&
          <div className="new_game_button">
            {endGame === "lost" ?
              <div>YOU LOST THE GAME</div>
              : endGame === "win" ?
                <div>YOU WON THE GAME</div>
                : endGame === "left" ?
                  <div>{player2} HAS LEFT THE GAME</div>
                  : endGame === "full_game" &&
                  <div>THE GAME HAS STARTED</div>}
            <div>
              <button className="ripple"
                onClick={() => initialGame()}>
                Start a new game
              </button>
            </div>
          </div>
        }
      </div>
    </>
  );
}


export default App;
