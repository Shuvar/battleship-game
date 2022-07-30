import React, { useEffect } from 'react';
import computerBoards from './computerBoards' //   to create in the future


function createTable(numOfCalls) {
    let table = [];
    for (let key = 0; key < numOfCalls; key++) {
        table.push({
            key,
            className: '',
            selected: false
        });
    };
    return table;
};

let randomBoardNumber = Math.round(Math.random() *1);
const computerBoard = computerBoards[randomBoardNumber];


function createComputerLegend(legend) {
    let shipsLegend = [];
    for (let i = 0; i < legend.length; i++) {
        shipsLegend.push({
            shipId: i,
            length: legend[i].length,
            shipCordinates: legend[i],
            numOfHit: 0,
            shipSunk: ""
        })
    }
    return shipsLegend;
}


function ComputerGame({ endGame, setEndGame, setThinkingCircle, isMyTurn, setIsMyTurn, boardRow, boardColumn, hitBoard, setHitBoard, shipsLegend, setShipsLegend }) {

    const [computerGameBoard, setComputerGameBoard] = React.useState(createTable(100))
    const [computerLegend, setComputerLegend] = React.useState(createComputerLegend(computerBoard))
    const [computerTurn, setComputerTurn] = React.useState(false)
    const computerHitBoard = createTable(100);
    // const time = setTimeout(computerTurn, 1000);

    function shot(cellNumber) {     // shot the computerBoard
        if (!computerGameBoard[cellNumber].selected) {
            let find = false;
            let newComputerLegend = [...computerLegend];
            let newComputerGameBoard = [...computerGameBoard];
            newComputerGameBoard[cellNumber].selected = true;
            for (let i = 0; i < newComputerLegend.length; i++) {
                for (let j = 0; j < newComputerLegend[i].shipCordinates.length; j++) {
                    if (newComputerLegend[i].shipCordinates[j] === cellNumber) {
                        newComputerLegend[i].numOfHit++;
                        newComputerGameBoard[cellNumber].className = "hit";
                        find = true;
                        if (newComputerLegend[i].numOfHit === newComputerLegend[i].length) {
                            newComputerLegend[i].shipSunk = "sunk"
                        };
                        checkIfWon(newComputerGameBoard, "win")
                    };
                };
            };
            if (!find) {
                newComputerGameBoard[cellNumber].className = "missed";
                setIsMyTurn(false);
                setThinkingCircle(true)
                setTimeout(setComputerTurn,1000,(!computerTurn));
            };
            setComputerGameBoard(newComputerGameBoard);
            setComputerLegend(newComputerLegend);
        };
    };

    useEffect(() => {       // computer turn
        if (!isMyTurn && endGame==="") {
            setThinkingCircle(false)
            let newHitBoard = [...hitBoard];
            let newShipsLegend = [...shipsLegend];
            if (!isMyTurn) {
                let randomCellNumber = Math.round(Math.random() * 99);
                if (!newHitBoard[randomCellNumber]?.selected) {
                    let find = false;
                    newHitBoard[randomCellNumber].selected = true;
                    for (let i = 0; i < newShipsLegend.length; i++) {
                        for (let j = 0; j < newShipsLegend[i]?.cordinates?.length; j++) {
                            if (newShipsLegend[i]?.cordinates[j] === randomCellNumber) {
                                find = true;
                                newHitBoard[randomCellNumber].className = "hit";
                                newShipsLegend[i].numOfHit++;
                                if (newShipsLegend[i].numOfHit === newShipsLegend[i].length) {
                                    newShipsLegend[i].shipSunk = "sunk"
                                };
                                setThinkingCircle(true)
                                checkIfWon(newHitBoard, "lost")
                            };
                        };
                        setTimeout(setComputerTurn,1000,(!computerTurn));                    };
                    if (!find) {
                        newHitBoard[randomCellNumber].className = "missed";
                        setIsMyTurn(true);
                        setThinkingCircle(false);
                    };
                } else setTimeout(setComputerTurn,1000,(!computerTurn));
            };
            setHitBoard(newHitBoard);
            setShipsLegend(newShipsLegend);
        };
    }, [computerTurn]);

    function checkIfWon(board, playerSituation) {  // בודק אם השחקן ניצח
        let count = 0;
        for (let i = 0; i < board.length; i++) {
            if (board[i]?.className === "hit") {
                count++;
            };
        };
        if (count === 20) {
            setIsMyTurn(false);
            setEndGame(playerSituation);
            setThinkingCircle(false);
        };
    };

    useEffect(() => {
        if (endGame === "") {
            setComputerGameBoard(createTable(100));
            setComputerLegend(createComputerLegend(computerBoard));
            setComputerTurn(false);
        }
    }, [endGame]);
    return (
        <>
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
                        {computerGameBoard.map((cell, i) => {
                            return <>
                                <span key={i}
                                    className={`game_board_cell ${cell?.className} ${!isMyTurn && "blurred"}`}
                                    onClick={() => shot(i)}>
                                </span>
                            </>
                        })}
                        {!isMyTurn &&
                            <div className="opponentboard2">
                                {computerHitBoard.map((cell, i) => {
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
                    {computerLegend.map((ship, i) => {
                        return (<>
                            <span key={i}
                                className={`ship${ship.length} 
                              ${ship.shipSunk === `sunk` ? ship.shipSunk : `opponentShip`}`}>
                            </span>
                        </>)
                    })}
                </div>
            </div>
        </>
    )
}


export default ComputerGame;