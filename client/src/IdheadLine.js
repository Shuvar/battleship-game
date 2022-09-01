import React from 'react';

function IdheadLine({ player2Id, computerPlayer, gameId, initialGame }) {
    return (
        <>
            <div className="second_headLine_all">
                <button
                    className="ripple new_game_button_title"
                    onClick={() => initialGame()}>
                    NEW GAME
                </button>
                {(!computerPlayer && !player2Id) &&
                <div className="second_headLine">
                    <h2 className="second_headLine_text">ID game:</h2>
                    <h2 className="id_game_text"> {gameId}<br></br></h2>
                    <h2 className="second_headLine_text">Invite a friend to play</h2>
                </div>
                }
                <div className="new_game_button_title"></div>
            </div>
        </>
    )
};

export default IdheadLine;