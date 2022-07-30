import React, { useEffect } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

let messageData = {
    chatRoom: "",
    message: "",
    time: 0
}

function Chat({ socket, room, playerName, endGame }) {

    const [currentMessage, setCurrentMessage] = React.useState("");
    const [messageList, setMessageList] = React.useState([]);
    const [chatOn, setChatOn] = React.useState(true);

    function sendmessage() {
        console.log("currentmessage:", currentMessage)
        if (currentMessage !== "") {
            messageData = {
                chatRoom: room,
                message: currentMessage,
                playerName: playerName,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }
            let newMessageList = [...messageList];
            newMessageList = [...newMessageList, messageData]
            setMessageList(newMessageList);
            setCurrentMessage("");
            setChatOn(true);
            socket.emit("send-message", messageData, room);
        }
    }

    useEffect(() => {
        socket.on("resive-message", data => {
            setChatOn(true);
            let newMessageList = [...messageList];
            newMessageList = [...newMessageList, data]
            setMessageList(newMessageList);
        })
    }, [messageList])

    useEffect(() => {
        if (endGame === "") {
            setMessageList([]);
        };
    }, [endGame])


    return (
        <div className="chat">
            <div className="chat_container">
                <button
                    className="chat_tuggle_button ripple"
                    onClick={() => setChatOn(!chatOn)}>
                    {chatOn ? "close chat" : "open chat"}
                </button>
                {chatOn &&
                    <ScrollToBottom className="chat_messages_list">
                        {messageList.map((messageContent, i) => {
                            return (
                                <div className={messageContent.playerName === playerName ?
                                    "chat_messages_div_host"
                                    : "chat_messages_div_opponent"} key={i}>
                                    <span className={messageContent.playerName === playerName ?
                                        "chat_messages_host"
                                        : "chat_messages_opponent"}>
                                        {messageContent.playerName}: {messageContent.message}
                                    </span>
                                </div>
                            )
                        })
                        }
                    </ScrollToBottom>
                }
                <div className="chat_input_and_button_line">
                    <input
                        placeholder="write a message"
                        className="chat_input"
                        value={currentMessage}
                        type="text"
                        onChange={(e) => setCurrentMessage(e.target.value)}>
                    </input>
                    <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        onClick={() => sendmessage()}>
                        Send
                    </Button>
                    {/* <button className="chat_button ripple" onClick={() => { sendmessage() }}>send message</button> */}
                </div>
            </div>
        </div>

    )
}

export default Chat;