import React from 'react';



function StartPage({ setPlayer1, setPlayer1Id, socket, inputPlayerName, inputGameId, setInputPlayerName, setInputGameId }) {

    const [computerPlayer, setComputerPlayer] = React.useState(false);


    function checkIfValidNameJoinARoom() {  // לחיצה על צירוף למשחק
        if (inputPlayerName && inputGameId) {
          setPlayer1(inputPlayerName);
          setPlayer1Id(socket.id);
          socket.emit(`join-a-room`, { inputGameId, inputPlayerName })
          console.log("inputGameId, inputPlayerName:", inputGameId, inputPlayerName)
    
        }
      };
    
      function checkIfValidNameCreateARoom() {  // לחיצה על יצירת משחק חדש
        if (inputPlayerName) {
          socket.emit(`create-a-room`, `create-a-room`);
          setPlayer1(inputPlayerName);
          setPlayer1Id(socket.id);
        }
      };
    
    return (
        <>
            <div className="start_button flex_column">
                <h3>WELCOME</h3>
                <form >
                    <input type="text"
                        className="player_name_input"
                        placeholder="Enter your name"
                        onChange={(e) => setInputPlayerName(e.target.value)}>
                    </input>
                </form>
                <ul className="start_page_menu">
                    <li>
                        <button
                            className="ripple"
                            onClick={() => checkIfValidNameCreateARoom()}>
                            create a new game
                        </button>
                    </li>
                    <li>
                        <div >
                            <button
                                className="ripple"
                                onClick={() => checkIfValidNameJoinARoom()}>
                                Join a game
                            </button>
                            <input
                                className="player_name_input"
                                placeholder="Enter game Id"
                                onChange={(e) => setInputGameId(e.target.value)}>
                            </input>
                        </div>
                    </li>
                    <li>
                        <button
                            className="ripple"
                            onClick={() => setComputerPlayer(true)}>
                            play vs computer
                        </button>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default StartPage;