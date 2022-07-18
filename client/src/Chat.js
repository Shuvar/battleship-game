import React, { useEffect } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

let massageData = {
    chatRoom: "",
    massage: "",
    time: 0
}

function Chat({ socket, room, playerName, endGame }) {

    const [currentMassage, setCurrentMassage] = React.useState("");
    const [massageList, setMassageList] = React.useState([]);
    const [chatOn, setChatOn] = React.useState(true);



    function sendMassage() {
        console.log("currentMassage:", currentMassage)
        if (currentMassage !== "") {
            massageData = {
                chatRoom: room,
                massage: currentMassage,
                playerName: playerName,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }
            let newMassageList = [...massageList];
            newMassageList = [...newMassageList, massageData]
            setMassageList(newMassageList);
            setCurrentMassage("");
            setChatOn(true);
        }
    }
    useEffect(() => {
        socket.emit("send-massage", massageData, room);
    }, [massageData])

    useEffect(() => {
        socket.on("resive-massage", data => {
            setChatOn(true);
            let newMassageList = [...massageList];
            newMassageList = [...newMassageList, data]
            setMassageList(newMassageList);
        }, [massageList])
    })

    useEffect(() => {
        if (endGame !== "") {
            setMassageList([]);
        };
    }, [endGame])


    return (
        <div className="chat">
            <div className="chat_container">
                <button className="chat_tuggle_button ripple" onClick={() => setChatOn(!chatOn)}>{chatOn ? "close chat" : "open chat"}</button>
                {chatOn &&
                    <ScrollToBottom className="chat_massages_list">
                        {massageList.map((massageContent, i) => {
                            return (
                                <div className={massageContent.playerName === playerName ?
                                    "chat_massages_div_host"
                                    : "chat_massages_div_opponent"} key={i}>
                                    <span className={massageContent.playerName === playerName ?
                                        "chat_massages_host"
                                        : "chat_massages_opponent"}> 
                                        {massageContent.playerName}: {massageContent.massage}
                                    </span>
                                </div>
                            )
                        })}
                    </ScrollToBottom>
                }
                <div className="chat_input_and_button_line">
                    <input
                        placeholder="write a massage"
                        className="chat_input"
                        value={currentMassage}
                        type="text"
                        onChange={(e) => setCurrentMassage(e.target.value)}>
                    </input>
                    <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        onClick={() => { sendMassage() }}>
                        Send
                    </Button>
                    {/* <button className="chat_button ripple" onClick={() => { sendMassage() }}>send massage</button> */}
                </div>
            </div>
        </div>

    )
}

export default Chat;