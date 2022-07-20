import React from 'react';

function IdheadLine({ gameId, initialGame }) {
    return (
        <>
            <div className="game_title_id_all">
                <button
                    className="ripple new_game_button_title"
                    onClick={() => initialGame()}>
                    NEW GAME
                </button>
                <div className="game_title_id">
                    <h2 className="game_title_id_text">ID game:</h2>
                    <h2 style={{ color: "blue" }}> {gameId}<br></br></h2>
                    <h2 className="game_title_id_text">Invite a friend to play</h2>
                </div>
                <div className="new_game_button_title"></div>
            </div>
        </>
    )
};

export default IdheadLine;