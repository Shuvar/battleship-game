import React from 'react';


function StartPage({
    setPlayer1,
    setPlayer1Id,
    socket,
    inputPlayerName,
    inputGameId,
    setInputPlayerName,
    setInputGameId,
    setComputerPlayer,
    setPlayer2
}) {

    const [noName, setNoName] = React.useState("");
    const [noInputGameId, setNoInputGameId] = React.useState("");


    function checkIfValidNameJoinARoom() {  // לחיצה על צירוף למשחק
        if (inputPlayerName.trim(inputPlayerName) && inputGameId.trim(inputGameId)) {
            setPlayer1(inputPlayerName);
            setPlayer1Id(socket.id);
            socket.emit(`join-a-room`, { inputGameId, inputPlayerName })
        } else {
            if (inputPlayerName.trim(inputPlayerName) === "") {
                setNoName("name is mandatory");
            }
            if (inputGameId.trim(inputGameId) === "") {
                setNoInputGameId("no game id")
            }
        }
    };

    function checkIfValidNameCreateARoom() {  // לחיצה על יצירת משחק חדש
        if (inputPlayerName.trim(inputPlayerName)) {
            socket.emit(`create-a-room`, `create-a-room`);
            setPlayer1(inputPlayerName);
            setPlayer1Id(socket.id);
            setInputGameId("");
        } else setNoName("name is mandatory");
    };

    function checkIfValidNameVsComputer() {
        if (inputPlayerName.trim(inputPlayerName)) {
            setComputerPlayer(true);
            setPlayer1(inputPlayerName);
            setPlayer2("computer");
        } else setNoName("name is mandatory");
    }

    return (
        <>
            <div className="start_button flex_column">
                <h3>WELCOME</h3>
                <form >
                    <input
                        type="text"
                        className={noName ? "no_name_player_name_input" : "player_name_input"}
                        placeholder="Enter your name"
                        onChange={(e) => { setInputPlayerName(e.target.value); setNoName("") }}
                    />
                    <div className="no_name_style">{noName}</div>
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
                                className={noInputGameId ? "no_name_player_name_input" : "player_name_input"}
                                placeholder="Enter game Id"
                                onChange={(e) => {setInputGameId(e.target.value); setNoInputGameId("")}}
                            />
                            <div className="no_name_style">{noInputGameId}</div>
                        </div>
                    </li>
                    <li>
                        <button
                            className="ripple"
                            onClick={() => checkIfValidNameVsComputer()}>
                            play vs computer
                        </button>
                    </li>
                </ul>

            </div>
        </>
    )
}

export default StartPage;