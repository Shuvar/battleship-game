import React, { useEffect } from 'react';
import "./App.css";
import io from 'socket.io-client';
import Chat from "./Chat";
import IdheadLine from "./IdheadLine";
import StartPage from "./StartPage";

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
const opponnentbord2 = createTable(100);
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
  const [name, setName] = React.useState(true)  //1
  const [thinkingCircle, setThinkingCircle] = React.useState(false) //2
  const [endGame, setEndGame] = React.useState(""); //3
  const [hitAnswer, setHitAnswer] = React.useState({ answer: true, cellIndex: "" });  //4
  const [checkHit, setCheckHit] = React.useState(true); //5
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
  const [hostBoard, setHostBoard] = React.useState(createTable(100));   // the board of the game  16
  const [opponentBoard, setOpponentBoard] = React.useState(createTable(100)); //17
  const [hitBoard, setHitBoard] = React.useState(createTable(100)); //18
  const [selectedCells, setSelectedCells] = React.useState([]); // the cells that the player selected 19
  const [placeShip, setPlaceShip] = React.useState(false); // check if the player end to put all the ships  20
  const [submitDone, setSubmitDone] = React.useState(false); // check if the player end to put all the ships  21
  const [shipsLegend, setShipsLegend] = React.useState(initialShipLegend); // the legend of the ships 22
  const [opponentShipLegend, setOpponentShipLegend] = React.useState(initialShipLegend);  //23
  const [selectedShip, setSelectedShip] = React.useState(); // the ship that the player selected  //24
  const [direction, setDirection] = React.useState(true);  // the direction of the ship 25

  function checkIfSelected(ship) {
    if (ship?.status !== "placed") { // status of the ship
      setSelectedShip(ship);
    }
  };

  function cellOverHandler(i) {
    let newArray = [...hostBoard];    //very important to copy the array
    if (direction) {
      if (selectedShip?.length === 1) {
        newArray[i].classNameHover = "hover_select";
        setHostBoard(newArray);
        let selectedCellArray = [i];
        setSelectedCells(selectedCellArray);
      }
      if (selectedShip?.length === 2) {
        newArray[i].classNameHover = "hover_select";
        if ((i + 1) % 10 === 0) {
          newArray[i - 1].classNameHover = "hover_select"
          let selectedCellArray = [i, i - 1];
          setSelectedCells(selectedCellArray);
        }
        else {
          newArray[i + 1].classNameHover = "hover_select";
          let selectedCellArray = [i, i + 1];
          setSelectedCells(selectedCellArray);
        }
        setHostBoard(newArray)
      };
      if (selectedShip?.length === 3) {
        newArray[i].classNameHover = "hover_select";
        if ((i + 2) % 10 === 0) {
          newArray[i - 1].classNameHover = "hover_select";
          newArray[i + 1].classNameHover = "hover_select";
          setHostBoard(newArray);
          let selectedCellArray = [i, i - 1, i + 1];
          setSelectedCells(selectedCellArray);
        }
        else {
          if ((i + 1) % 10 === 0) {
            newArray[i - 1].classNameHover = "hover_select";
            newArray[i - 2].classNameHover = "hover_select";
            setHostBoard(newArray);
            let selectedCellArray = [i, i - 1, i - 2];
            setSelectedCells(selectedCellArray);
          }
          else {
            newArray[i + 2].classNameHover = "hover_select";
            newArray[i + 1].classNameHover = "hover_select";
            setHostBoard(newArray);
            let selectedCellArray = [i, i + 1, i + 2];
            setSelectedCells(selectedCellArray);
          };
        }
      }
      if (selectedShip?.length === 4) {
        newArray[i].classNameHover = "hover_select";
        if ((i + 3) % 10 === 0) {
          newArray[i - 1].classNameHover = "hover_select";
          newArray[i + 1].classNameHover = "hover_select";
          newArray[i + 2].classNameHover = "hover_select";
          setHostBoard(newArray);
          let selectedCellArray = [i, i - 1, i + 1, i + 2];
          setSelectedCells(selectedCellArray);
        }
        else {
          if ((i + 2) % 10 === 0) {
            newArray[i - 1].classNameHover = "hover_select";
            newArray[i - 2].classNameHover = "hover_select";
            newArray[i + 1].classNameHover = "hover_select";
            setHostBoard(newArray);
            let selectedCellArray = [i, i - 1, i - 2, i + 1];
            setSelectedCells(selectedCellArray);
          }
          else {
            if ((i + 1) % 10 === 0) {
              newArray[i - 1].classNameHover = "hover_select";
              newArray[i - 2].classNameHover = "hover_select";
              newArray[i - 3].classNameHover = "hover_select";
              setHostBoard(newArray);
              let selectedCellArray = [i, i - 1, i - 2, i - 3];
              setSelectedCells(selectedCellArray);
            } else {
              newArray[i + 3].classNameHover = "hover_select";
              newArray[i + 2].classNameHover = "hover_select";
              newArray[i + 1].classNameHover = "hover_select";
              setHostBoard(newArray);
              let selectedCellArray = [i, i + 1, i + 2, i + 3];
              setSelectedCells(selectedCellArray);
            }

          };
        }
      }
    } else {
      if (selectedShip?.length === 1) {
        newArray[i].classNameHover = "hover_select";
        setHostBoard(newArray);
        let selectedCellArray = [i];
        setSelectedCells(selectedCellArray);
      }
      if (selectedShip?.length === 2) {
        newArray[i].classNameHover = "hover_select";
        if ((i + 10) < 100) {
          newArray[i + 10].classNameHover = "hover_select";
          let selectedCellArray = [i, i + 10];
          setSelectedCells(selectedCellArray);
        }
        else {
          newArray[i - 10].classNameHover = "hover_select"
          let selectedCellArray = [i, i - 10];
          setSelectedCells(selectedCellArray);
        };
        setHostBoard(newArray)
      };
      if (selectedShip?.length === 3) {
        newArray[i].classNameHover = "hover_select";
        if ((i + 20) < 100) {
          newArray[i + 10].classNameHover = "hover_select";
          newArray[i + 20].classNameHover = "hover_select";
          setHostBoard(newArray);
          let selectedCellArray = [i, i + 10, i + 20];
          setSelectedCells(selectedCellArray);
        }
        else {
          if ((i + 10) < 100) {
            newArray[i + 10].classNameHover = "hover_select";
            newArray[i - 10].classNameHover = "hover_select";
            setHostBoard(newArray);
            let selectedCellArray = [i, i + 10, i - 10];
            setSelectedCells(selectedCellArray);
          }
          else {
            newArray[i - 20].classNameHover = "hover_select";
            newArray[i - 10].classNameHover = "hover_select";
            setHostBoard(newArray);
            let selectedCellArray = [i, i - 10, i - 20];
            setSelectedCells(selectedCellArray);
          };
        }
      }
      if (selectedShip?.length === 4) {
        newArray[i].classNameHover = "hover_select";
        if ((i + 30) < 100) {
          newArray[i + 10].classNameHover = "hover_select";
          newArray[i + 20].classNameHover = "hover_select";
          newArray[i + 30].classNameHover = "hover_select";
          setHostBoard(newArray);
          let selectedCellArray = [i, i + 10, i + 20, i + 30];
          setSelectedCells(selectedCellArray);
        }
        else {
          if ((i + 20) < 100) {
            newArray[i - 10].classNameHover = "hover_select";
            newArray[i + 20].classNameHover = "hover_select";
            newArray[i + 10].classNameHover = "hover_select";
            setHostBoard(newArray);
            let selectedCellArray = [i, i - 10, i + 20, i + 10];
            setSelectedCells(selectedCellArray);
          }
          else {
            if ((i + 10) < 100) {
              newArray[i - 10].classNameHover = "hover_select";
              newArray[i - 20].classNameHover = "hover_select";
              newArray[i + 10].classNameHover = "hover_select";
              setHostBoard(newArray);
              let selectedCellArray = [i, i - 10, i - 20, i + 10];
              setSelectedCells(selectedCellArray);
            } else {
              newArray[i - 30].classNameHover = "hover_select";
              newArray[i - 20].classNameHover = "hover_select";
              newArray[i - 10].classNameHover = "hover_select";
              setHostBoard(newArray);
              let selectedCellArray = [i, i - 10, i - 20, i - 30];
              setSelectedCells(selectedCellArray);
            }

          };
        }
      }
    }
  };

  function cellLeaveHandler(i) {
    let newArray = [...hostBoard];
    if (direction) {
      setSelectedCells([]);
      if (selectedShip?.length === 1) {
        newArray[i].classNameHover = "";
        setHostBoard(newArray);
      }
      if (selectedShip?.length === 2) {
        newArray[i].classNameHover = "";
        if ((i + 1) % 10 === 0) {
          newArray[i - 1].classNameHover = ""
        }
        else { newArray[i + 1].classNameHover = "" };
        setHostBoard(newArray);
      }
      if (selectedShip?.length === 3) {
        newArray[i].classNameHover = "";
        if ((i + 2) % 10 === 0) {
          newArray[i - 1].classNameHover = "";
          newArray[i + 1].classNameHover = "";
          setHostBoard(newArray);
        } else {
          if ((i + 1) % 10 === 0) {
            newArray[i - 1].classNameHover = "";
            newArray[i - 2].classNameHover = "";
            setHostBoard(newArray);
          } else {
            newArray[i + 2].classNameHover = "";
            newArray[i + 1].classNameHover = "";
            setHostBoard(newArray);
          }
        }
      }
      if (selectedShip?.length === 4) {
        newArray[i].classNameHover = "";
        if ((i + 3) % 10 === 0) {
          newArray[i - 1].classNameHover = "";
          newArray[i + 1].classNameHover = "";
          newArray[i + 2].classNameHover = "";
          setHostBoard(newArray);
        } else {
          if ((i + 2) % 10 === 0) {
            newArray[i - 1].classNameHover = "";
            newArray[i - 2].classNameHover = "";
            newArray[i + 1].classNameHover = "";
            setHostBoard(newArray);
          } else {
            if ((i + 1) % 10 === 0) {
              newArray[i - 1].classNameHover = "";
              newArray[i - 2].classNameHover = "";
              newArray[i - 3].classNameHover = "";
              setHostBoard(newArray);
            } else {
              newArray[i + 3].classNameHover = "";
              newArray[i + 2].classNameHover = "";
              newArray[i + 1].classNameHover = "";
              setHostBoard(newArray);
            }
          }
        }
      }
    } else {
      setSelectedCells([]);
      if (selectedShip?.length === 1) {
        newArray[i].classNameHover = "";
        setHostBoard(newArray);
      }
      if (selectedShip?.length === 2) {
        newArray[i].classNameHover = "";
        if ((i + 10) < 100) {
          newArray[i + 10].classNameHover = ""
        }
        else { newArray[i - 10].classNameHover = "" };
        setHostBoard(newArray)
      };
      if (selectedShip?.length === 3) {
        newArray[i].classNameHover = "";
        if ((i + 20) < 100) {
          newArray[i + 10].classNameHover = "";
          newArray[i + 20].classNameHover = "";
          setHostBoard(newArray);
        }
        else {
          if ((i + 10) < 100) {
            newArray[i + 10].classNameHover = "";
            newArray[i - 10].classNameHover = "";
            setHostBoard(newArray);
          }
          else {
            newArray[i - 20].classNameHover = "";
            newArray[i - 10].classNameHover = "";
            setHostBoard(newArray);
          };
        }
      }
      if (selectedShip?.length === 4) {
        newArray[i].classNameHover = "";
        if ((i + 30) < 100) {
          newArray[i + 10].classNameHover = "";
          newArray[i + 20].classNameHover = "";
          newArray[i + 30].classNameHover = "";
          setHostBoard(newArray);
        }
        else {
          if ((i + 20) < 100) {
            newArray[i - 10].classNameHover = "";
            newArray[i + 20].classNameHover = "";
            newArray[i + 10].classNameHover = "";
            setHostBoard(newArray);
          }
          else {
            if ((i + 10) < 100) {
              newArray[i - 10].classNameHover = "";
              newArray[i - 20].classNameHover = "";
              newArray[i + 10].classNameHover = "";
              setHostBoard(newArray);
            } else {
              newArray[i - 30].classNameHover = "";
              newArray[i - 20].classNameHover = "";
              newArray[i - 10].classNameHover = "";
              setHostBoard(newArray);
            }

          };
        }
      }
    }
  };

  function cellClickHandler() {
    if (selectedShip) {
      let checkSelectedCells = true;
      for (let i = 0; i < selectedCells.length && checkSelectedCells; i++) {
        if (hostBoard[selectedCells[i]].classNameSelected || hostBoard[selectedCells[i]].classNameAroundShip) {
          checkSelectedCells = false;
        }
      }
      if (checkSelectedCells) {
        fillSelectedCell(selectedCells, selectedShip); // פונקציה שמכניסה את התאים שנבחרו ושליד מה שנבחר לאוביקט של הספינה שנבחרה
        setSelectedShip();
        setSelectedCells([]);
      }
    }
  };

  function fillSelectedCell(choosenCells, shipSelected) { // נותן לספינה את הקורדינטות של התאים מסביבה
    let aroundCellArray = [];
    for (let j = 0; j < choosenCells.length; j++) {
      if (choosenCells[j] === 0) {
        aroundCellArray.push(choosenCells[j] + 1, choosenCells[j] + 10, choosenCells[j] + 11);
      } else {
        if (choosenCells[j] === 9) {
          aroundCellArray.push(choosenCells[j] - 1, choosenCells[j] + 10, choosenCells[j] + 9);
        } else {
          if (choosenCells[j] === 90) {
            aroundCellArray.push(choosenCells[j] + 1, choosenCells[j] - 10, choosenCells[j] - 9);
          } else {
            if (choosenCells[j] === 99) {
              aroundCellArray.push(choosenCells[j] - 1, choosenCells[j] - 10, choosenCells[j] - 11);
            } else {
              if (choosenCells[j] % 10 === 0) {
                aroundCellArray.push(choosenCells[j] + 1, choosenCells[j] + 10, choosenCells[j] - 10, choosenCells[j] - 9, choosenCells[j] + 11);
              } else {
                if ((choosenCells[j] + 1) % 10 === 0) {
                  aroundCellArray.push(choosenCells[j] - 1, choosenCells[j] + 10, choosenCells[j] - 10, choosenCells[j] - 11, choosenCells[j] + 9);
                } else {
                  if (choosenCells[j] < 10) {
                    aroundCellArray.push(choosenCells[j] + 1, choosenCells[j] + 10, choosenCells[j] - 1, choosenCells[j] + 11, choosenCells[j] + 9);
                  } else {
                    if (choosenCells[j] > 90) {
                      aroundCellArray.push(choosenCells[j] - 1, choosenCells[j] + 1, choosenCells[j] - 10, choosenCells[j] - 11, choosenCells[j] - 9);
                    } else {
                      aroundCellArray.push(choosenCells[j] + 1, choosenCells[j] - 1, choosenCells[j] + 10, choosenCells[j] - 10, choosenCells[j] - 9, choosenCells[j] + 9, choosenCells[j] + 11, choosenCells[j] - 11);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    shipSelected.aroundCells = aroundCellArray;
    shipSelected.status = "placed";
    shipSelected.cordinates = choosenCells;

    let newShipsLegend = [...shipsLegend];
    for (let i = 0; i < newShipsLegend.length; i++) {   // מחליף את הספינה בתוך הסטייט של הספינות
      if (newShipsLegend[i].shipId === shipSelected.shipId) {
        newShipsLegend[i] = shipSelected;
      }
    }
    setShipsLegend(newShipsLegend);
    cellPainter(newShipsLegend); // קריאה לפונקציה אשר צובעת את התאים בלוח
  };

  function deleteShip(ship) {   //מוחקת בחירת ספינה
    let newShipsLegend = [...shipsLegend];
    for (let i = 0; i < newShipsLegend.length; i++) {
      if (newShipsLegend[i].shipId === ship) {
        newShipsLegend[i].cordinates = [];
        newShipsLegend[i].aroundCells = [];
        newShipsLegend[i].status = "";
      }
    }
    cellPainter(newShipsLegend);
    setPlaceShip("")
  };

  function cellPainter(newShipsLegend) {
    let newArray = createTable(100);  //מוחק את הטבלה של השחקן הראשון בכדי לצבוע אותה לפי הנ.צ של הספינות

    for (let i = 0; i < newShipsLegend.length; i++) {

      for (let j = 0; j < newShipsLegend[i].cordinates?.length; j++) {
        newArray[newShipsLegend[i].cordinates[j]].classNameSelected = "cell_selected";
        newArray[newShipsLegend[i].cordinates[0]].shipId = newShipsLegend[i].shipId;
      }
    }
    for (let i = 0; i < newShipsLegend.length; i++) {
      for (let j = 0; j < newShipsLegend[i].aroundCells?.length; j++) {
        newArray[newShipsLegend[i].aroundCells[j]].classNameAroundShip = "cell_around_ship";
      }
    }
    setHostBoard(newArray);
    setShipsLegend(newShipsLegend);
    setSelectedCells([]);
    setSelectedShip();
  };

  function doneButton() {
    let count = 0;
    for (let i = 0; i < hostBoard.length; i++) {
      if (hostBoard[i].classNameSelected === "cell_selected") {
        count++;
      }
      if (count === 20) {
        setPlaceShip(true);
      }
    }
  }

  function clearArouandCells() {    // מוחקת את כל התאים מסביב לספינות
    let newShipsLegend = [...shipsLegend];
    for (let i = 0; i < newShipsLegend.length; i++) {
      newShipsLegend[i].aroundCells = [];
    }
    cellPainter(newShipsLegend)
    socket.emit("waiting-msg", gameId)
  };

  useEffect(() => {
    console.log('connected!!! id1:', socket.id);
    socket.on("connect", () => {
      console.log('connected!!! id2:', socket.id);
      initialGame();
      console.log('inputPlayerName, gameId:', inputPlayerName, gameId);
    });
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
  }, []);

  useEffect(() => {
    socket.on("name", (userId, inputGameId, inputPlayerName) => {
      setName({ userId, inputGameId, inputPlayerName })
    })
  });

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
    socket.on(`first-turn`, (data) => {
      setIsMyTurn(true);
    });
    socket.on(`turn`, (data) => {
      setIsMyTurn(data);
    });
    socket.on("check-hit", (data) => {
      setCheckHit(data)
    });
    socket.on("hit-result", (data) => {
      setHitAnswer(data);
    });
    socket.on(`end-game`, (data) => {
      setIsMyTurn(false)
      setEndGame("lost")
    });
  }, [gameId]);

  useEffect(() => {
    checkHit !== true && checkOppenentShot(checkHit);
  }, [checkHit]);

  useEffect(() => {
    hitAnswer.cellIndex !== "" && resultHit(hitAnswer);
  }, [hitAnswer]);

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

  function shot(cellIndex) {    //יורה בלוח ושולח את הנ.צ של התא לשחקן השני
    if (!opponentBoard[cellIndex]?.selected) {
      let newOpponentBoard = [...opponentBoard];
      newOpponentBoard[cellIndex].selected = true;
      setOpponentBoard(newOpponentBoard);
      setIsMyTurn(false);
      setThinkingCircle(true)
      socket.emit("check-hit", { cellIndex, gameId });
    }
  };

  function checkOppenentShot(cell) {    //בודק אם השחקן היריב פגע בי ומשנה את הצבע בלוח המשחק שלי
    let find = false;
    let sunkShipId = 0;
    let newHitBoard = [...hitBoard];
    for (let i = 0; i < shipsLegend.length; i++) {
      for (let j = 0; j < shipsLegend[i]?.cordinates?.length; j++) {
        if (shipsLegend[i]?.cordinates[j] === cell) {
          find = true;
          newHitBoard[cell].className = "hit";
          shipsLegend[i].numOfHit++;
          if (shipsLegend[i].numOfHit === shipsLegend[i].length) {
            sunkShipId = shipsLegend[i].shipId
          }
        }
      }
    }
    if (!find && submitDone) {
      newHitBoard[cell].className = "missed";
      setIsMyTurn(true);
    }
    setHitBoard(newHitBoard);
    socket.emit("hit-result", { result: find, cellIndex: cell, gameId, sunkShipId });
    socket.emit('turn', { find, gameId });
  };

  function resultHit(answer) {    //משנה את הצבע בלוח השחקן היריב 
    setThinkingCircle(false)
    let newOpponentBoard = [...opponentBoard];
    if (answer.result) {
      newOpponentBoard[answer.cellIndex].className = "hit";
      newOpponentBoard[answer.cellIndex].selected = true;
    }
    if (!answer.result) {
      newOpponentBoard[answer.cellIndex].className = "missed";
      newOpponentBoard[answer.cellIndex].selected = true;
    }
    if (answer.sunkShipId > 0) {
      let newOpponentShipLegent = [...opponentShipLegend];
      for (let i = 0; i < newOpponentShipLegent.length; i++) {
        if (newOpponentShipLegent[i].shipId === answer.sunkShipId) {
          newOpponentShipLegent[i].shipSunk = "sunk"
        }
      }
      setOpponentShipLegend(newOpponentShipLegent);
    }
    setOpponentBoard(newOpponentBoard)
    checkIfWon(newOpponentBoard);
  };

  function initialGame() {  // מאתחל את המשחק
    setHostBoard(createTable(100));
    setHitBoard(createTable(100));
    setOpponentBoard(createTable(100));
    setPlayer2("");
    setSelectedShip();
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
    setPlaceShip(false);
    setWaiting(false);
    setPlayer1("");
    setGameId(null);
    setIsMyTurn(false);
    setSubmitDone(false);
    setDirection(true);
    setSelectedCells([]);
    setEndGame("");
    setUserDisconnected(true);
    setPlayer2Id("");
    setInputGameId("");
    setInputPlayerName("");
    setCheckHit(true);
    setOpponentShipLegend([
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

  function checkIfWon(board) {  // בודק אם השחקן ניצח
    let count = 0;
    for (let i = 0; i < board.length; i++) {
      if (board[i]?.className === "hit") {
        count++;
      }
    }
    if (count === 20) {
      socket.emit(`end-game`, { inputPlayerName, gameId });
      setEndGame("win");
      setIsMyTurn(false);
    }
  };



  return (
    <>
      <div className="circle_container">
        {thinkingCircle && <div className="circle"></div>}
        <h1 className="game_title">BattleShip Game</h1>
        {gameId &&
          <IdheadLine
            gameId={gameId}
            funInitialGame={initialGame}
          />
        }
        {!player1 &&
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
        {player1 &&
          <div>
            <Chat
              socket={socket} room={gameId} playerName={player1} player2Name={player2} endGame={endGame} />
            <div className="players_title">
              <h2 className="player_title host_name_color">{player1}</h2>
              <h2 className="player_title opponent_name_color">{player2}</h2>
            </div>
            <div className="gameContainer">
              <div className="player_game_board_order">
                <div className="player_game_board">
                  <div className="flex_column">
                    <div className="ships_legend">
                      {shipsLegend.map((ship, i) => {
                        return (
                          <span key={i}
                            className={`ship${ship.length} 
                              ${ship.length === ship.numOfHit ? `ship_was_hit` : (ship?.status ? ship?.status : `hostShip`)}`}
                            onClick={() => checkIfSelected(ship)}>
                          </span>)
                      })}
                    </div>
                    {selectedShip &&
                      <button className="change_direction_button ripple"
                        onClick={() => setDirection(!direction)}>Change<br></br> Direction
                      </button>
                    }
                  </div>
                  <div className="board_container">
                    <div className="board_row">
                      {boardRow.map((cell, i) => {
                        return <span key={i} className="board_row_cell">{(i + 10).toString(36).toUpperCase()}</span>
                      })}
                    </div>
                    <div className="board_column">
                      {boardColumn.map((cell, i) => {
                        return <span key={i} className="board_column_cell">{i + 1}</span>
                      })}
                    </div>
                    <div className="game_board">
                      {hostBoard.map((cell, i) => {
                        return (<>
                          <span key={i}
                            className={`game_board_cell 
                            ${cell?.classNameSelected ?
                                cell.classNameSelected
                                : (cell?.classNameAroundShip ?
                                  cell.classNameAroundShip
                                  : cell?.classNameHover)} 
                                `}
                            onMouseOver={() => cellOverHandler(i)}
                            onMouseLeave={() => cellLeaveHandler(i)}
                            onClick={() => cellClickHandler()}>
                            {cell.shipId &&
                              (!submitDone &&
                                <div className="deletebutton"
                                  onClick={() => deleteShip(cell.shipId)}>X
                                </div>)}
                          </span>
                        </>)
                      })}
                      {(submitDone) &&
                        <div className="hitBoard">
                          {hitBoard.map((cell, i) => {
                            return <>
                              <span key={i}
                                className={cell.className}>
                              </span>
                            </>
                          })}
                        </div>}
                    </div>
                  </div>
                </div>
                {!placeShip ?
                  <div className="flex_column">
                    <div className="place_order">place your ships on the board</div>
                    <button
                      className="place_ships_button_done ripple"
                      onClick={() => doneButton()}>
                      DONE
                    </button>
                  </div>
                  : !submitDone &&
                  <div className="flex_column">
                    <div className="place_order">are you sure???</div>
                    <button
                      className="place_ships_button_done ripple"
                      onClick={() => {
                        setSubmitDone(true);
                        clearArouandCells();
                      }}>
                      yes
                    </button>
                  </div>}

              </div>
              <div className="player_game_board_order">
                {(player2 && !userDisconnected && submitDone && waiting) ?
                  <div className="player_game_board">
                    <div className="board_container">
                      <div className="board_row">
                        {boardRow.map((cell, i) => {
                          return <span key={i} className="board_row_cell">{(i + 10).toString(36).toUpperCase()}</span>
                        })}
                      </div>
                      <div className="board_column">
                        {boardColumn.map((cell, i) => {
                          return <span key={i} className="board_column_cell">{i + 1}</span>
                        })}
                      </div>
                      <div className="game_board">
                        {opponentBoard.map((cell, i) => {
                          return <>
                            <span key={i}
                              className={`game_board_cell ${cell?.className} ${!isMyTurn && "blurred"}`}
                              onClick={() => shot(i)}>

                            </span>
                          </>
                        })}
                        {!isMyTurn &&
                          <div className="opponentboard2">
                            {opponnentbord2.map((cell, i) => {
                              return <>
                                <span key={i}
                                  className="opacity">
                                </span>
                              </>
                            })}
                          </div>}
                      </div>

                    </div>
                    <div className="opponent_ships_legend">
                      {opponentShipLegend.map((ship, i) => {
                        return (<>
                          <span key={i}
                            className={`ship${ship.length} 
                              ${ship.shipSunk === `sunk` ? ship.shipSunk : `opponentShip`}`}>
                          </span>
                        </>)
                      })}
                    </div>
                  </div>
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
                      <button className="ripple" onClick={() => initialGame()}>Start a new game</button>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>}



      </div>
    </>
  );
}


export default App;
