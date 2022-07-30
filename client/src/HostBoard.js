import React, { useEffect } from 'react';


function HostBoard({ endGame, socket, placeShip, setPlaceShip, submitDone, setSubmitDone, boardRow, boardColumn, createTable, gameId, setIsMyTurn, initialShipLegend, computerPlayer, hitBoard, setHitBoard, shipsLegend, setShipsLegend}) {

    const [hostBoard, setHostBoard] = React.useState(createTable(100));   // the board of the game  16
    const [selectedCells, setSelectedCells] = React.useState([]); // the cells that the player selected 19
    const [selectedShip, setSelectedShip] = React.useState(); // the ship that the player selected  //24
    const [direction, setDirection] = React.useState(true);
    const [checkHit, setCheckHit] = React.useState(true); //5

    useEffect(() => {
        if (endGame === "") {
            setSelectedShip();
            setSelectedCells([]);
            setDirection(true);
            setCheckHit(true);
            setHostBoard(createTable(100));   
        };
    }, [endGame])

    useEffect(() => {
        socket.on("check-hit", (data) => {
            setCheckHit(data)
        });
    }, [gameId]);

    useEffect(() => {
        checkHit !== true && checkOppenentShot(checkHit);
    }, [checkHit]);

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
        cellPainter(newShipsLegend);
        if (computerPlayer) {
            setIsMyTurn(true);
        }
        socket.emit("waiting-msg", gameId)
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

    return (
        <>
            <div className="player_game_board_order">
                <div className="player_game_board">
                    <div className="flex_column">
                        <div className="ships_legend">
                            {shipsLegend.map((ship, i) => {
                                return (
                                    <span key={i}
                                        className={`ship${ship.length} 
                                            ${ship.length === ship.numOfHit ?
                                                `ship_was_hit`
                                                : (ship?.status ? ship?.status : `hostShip`)}`}
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
                                                </div>
                                            )
                                        }
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
        </>
    )
}

export default HostBoard;