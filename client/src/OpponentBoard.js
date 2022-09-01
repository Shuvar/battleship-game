import React, { useEffect } from 'react';
import Chat from "./Chat";

function OpponentBoard({ player1, player2, socket, gameId, endGame, setEndGame, boardRow, boardColumn, isMyTurn, setIsMyTurn, createTable, initialShipLegend, setThinkingCircle }) {

    const opponnentbord2 = createTable(100);
    const [opponentBoard, setOpponentBoard] = React.useState(createTable(100)); //17
    const [opponentShipLegend, setOpponentShipLegend] = React.useState(initialShipLegend);  //23
    const [hitAnswer, setHitAnswer] = React.useState({ answer: true, cellIndex: "" });  //4

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

    function checkIfWon(board) {  // בודק אם השחקן ניצח
        let count = 0;
        for (let i = 0; i < board.length; i++) {
            if (board[i]?.className === "hit") {
                count++;
            }
        }
        if (count === 20) {
            socket.emit(`end-game`, gameId);
            setIsMyTurn(false);
            setEndGame("win");
        }
    };

    useEffect(() => {
        if (endGame === "") {
            setOpponentBoard(createTable(100));
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
        }
    }, [endGame]);

    useEffect(() => {
        socket.on("hit-result", (data) => {
            setHitAnswer(data);
        })
    }, []);

    useEffect(() => {
        hitAnswer.cellIndex !== "" && resultHit(hitAnswer);
    }, [hitAnswer]);

    return (
        <>
            <div className="opponent_player_game_board">
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
        </>
    )


}

export default OpponentBoard;