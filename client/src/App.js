import React from 'react';
import "./App.css";
import io from 'socket.io-client';
import Chat from "./Chat";
import IdheadLine from "./IdheadLine";
import StartPage from "./StartPage";
import HostBoard from "./HostBoard";
import SocketFunctions from "./Socket";
import OpponentBoard from "./OpponentBoard";
import ComputerGame from "./ComputerGame";

function createTable(numOfCalls) {
  let table = [];
  for (let key = 0; key < numOfCalls; key++) {
    table.push({
      key,
      className: '',
      selected: ``
    });
  };
  return table;
};

// const socket = io("ws://localhost:3030");
const socket = io("https://battleship-app-server.herokuapp.com");

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

function getWindowDimensions() {

  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function App() {

  // const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());
  // const [touchScreen, setTouchScreen] = React.useState(false)
  const [thinkingCircle, setThinkingCircle] = React.useState(false) //1
  const [endGame, setEndGame] = React.useState(""); //2
  const [inputGameId, setInputGameId] = React.useState(""); //3
  const [gameId, setGameId] = React.useState(null); //4
  const [waiting, setWaiting] = React.useState(false);  //5
  const [isMyTurn, setIsMyTurn] = React.useState(false);  //6
  const [userDisconnected, setUserDisconnected] = React.useState(true); // 7
  const [inputPlayerName, setInputPlayerName] = React.useState(""); // the player name in the input 8
  const [player1, setPlayer1] = React.useState("");  // player1 name  9
  const [player2, setPlayer2] = React.useState("");  // player2 name  10
  const [player1Id, setPlayer1Id] = React.useState(""); //11
  const [player2Id, setPlayer2Id] = React.useState(""); //12
  const [computerPlayer, setComputerPlayer] = React.useState(false);// 13
  const [placeShip, setPlaceShip] = React.useState(false); // check if the player end to put all the ships  14
  const [submitDone, setSubmitDone] = React.useState(false); // check if the player end to put all the ships  15
  const [shipsLegend, setShipsLegend] = React.useState(initialShipLegend); // the legend of the ships 16
  const [hitBoard, setHitBoard] = React.useState(createTable(100)); //17

  function initialGame() {  // מאתחל את המשחק
    setComputerPlayer(false);
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
    setComputerPlayer(false);
    setHitBoard(createTable(100));
    setShipsLegend([
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
    ]);
    socket.emit(`leave-game`, gameId)
  };

  return (
    <>

      {/* {console.log("size:", windowDimensions)} */}
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
        {endGame === "full_game" &&
          <div className="end_game_box_container">
            <div className="new_game_button">
              <div>THE GAME ALREADY STARTED</div>
              <div>
                <button className="ripple"
                  onClick={() => initialGame()}>
                  Back to main menu
                </button>
              </div>
            </div>
          </div>
        }
        {(player1 && player1Id && gameId === null && inputGameId && endGame !== "full_game" && !computerPlayer) &&
          <div className="end_game_box_container">
            <div className="new_game_button">
              <div>GAME {inputGameId} DOES NOT EXIST</div>
              <div>
                <button className="ripple"
                  onClick={() => initialGame()}>
                  Back to main menu
                </button>
              </div>
            </div>
          </div>
        }
        {(gameId || computerPlayer) &&
          <IdheadLine
            player2Id={player2Id}
            computerPlayer={computerPlayer}
            gameId={gameId}
            initialGame={initialGame}
          />
        }
        {(!player1 && !gameId) &&
          <StartPage
            initialGame={initialGame}
            inputPlayerName={inputPlayerName}
            inputGameId={inputGameId}
            setPlayer1Id={setPlayer1Id}
            setPlayer1={setPlayer1}
            setInputPlayerName={setInputPlayerName}
            setInputGameId={setInputGameId}
            socket={socket}
            setComputerPlayer={setComputerPlayer}
            setPlayer2={setPlayer2}
          />
        }
        {((player1 && gameId) || (player1 && computerPlayer)) &&
          <div>
            <div className="players_title">
            </div>
            <div className="gameContainer">
              <HostBoard
                initialGame={initialGame}
                isMyTurn={isMyTurn}
                player2={player2}
                waiting={waiting}
                player1={player1}
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
                computerPlayer={computerPlayer}
                hitBoard={hitBoard}
                setHitBoard={setHitBoard}
                shipsLegend={shipsLegend}
                setShipsLegend={setShipsLegend}
              />
              <div className="player_game_board_order">
                <div className="flex_column">
                  <h2 className="player_title opponent_name_color">{player2}</h2>
                </div>
                {(player2 && !userDisconnected && submitDone && waiting) ?
                  <OpponentBoard
                    player1={player1}
                    player2={player2}
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
                  (computerPlayer && submitDone ?
                    <ComputerGame
                      player2={player2}
                      endGame={endGame}
                      setEndGame={setEndGame}
                      setThinkingCircle={setThinkingCircle}
                      isMyTurn={isMyTurn}
                      setIsMyTurn={setIsMyTurn}
                      boardRow={boardRow}
                      boardColumn={boardColumn}
                      hitBoard={hitBoard}
                      setHitBoard={setHitBoard}
                      shipsLegend={shipsLegend}
                      setShipsLegend={setShipsLegend}
                    />
                    :
                    ((waiting && !userDisconnected && !computerPlayer) ?
                      <div className="player_game_board_msg_container waiting_animation">{player2} has finished and waiting for you</div>
                      : (player2 ? <div className="player_game_board_msg_container waiting_animation">Waiting for {player2}, he's not ready yet</div>
                        : <div className="player_game_board_msg_container waiting_animation">Waiting for someone to join in</div>)))
                }
                {gameId &&
                  <Chat
                    socket={socket}
                    room={gameId}
                    playerName={player1}
                    player2Name={player2}
                    endGame={endGame}
                  />
                }
              </div>
            </div>
          </div>
        }
      <div className="rights">created by Vardi Shuki</div>
      </div>
    </>
  );
}


export default App;
