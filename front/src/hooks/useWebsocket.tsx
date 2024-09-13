import { useCallback, useEffect, useRef, useState } from "react"
import useAuth from "./useAuth";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "@store/slices/notificationSlice";

const WEBSOCKET_URL = 'ws://localhost/ws/';

const TYPE_AUTHENTICATE = 'authenticate';
const TYPE_AUTHENTICATION_SUCCED = 'auth_succeed';
const TYPE_AUTHENTICATION_FALED = 'auth_failed';
const TYPE_ALERT = 'alert';
const TYPE_CALENDAR = 'calendar';

const useWebsocket = () => {
    const [readyState, setReadyState] = useState<number>(WebSocket.CLOSED);
    const socketRef = useRef<WebSocket|null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if(readyState === WebSocket.OPEN) {
            sendMessage(TYPE_AUTHENTICATE, localStorage.getItem('token'))
        }
    }, [readyState])

    const openConnection = useCallback(() => {
        const socket = new WebSocket(WEBSOCKET_URL);

        socket.onopen = () => {
            setReadyState(socket.readyState);
        }

        socket.onclose = () => {
            console.log("CONNECTION CLOSED")
            setReadyState(socket.readyState);
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data)
            switch(data.type) {
                case TYPE_AUTHENTICATION_FALED:
                case TYPE_AUTHENTICATION_SUCCED:
                    break;

                default:
                    dispatch(addNotification(data));
                    break;
            }
        }

        socket.onerror = (error) => {
            console.log("WEBSOCKET ERROR: ", error);
        }

        socketRef.current = socket;
    }, [])

    useEffect(() => {
        return () => {
            if(socketRef.current)
                socketRef.current.close();
        }
    }, [])

    const sendMessage = useCallback((type: string, content: any) => {
        if(socketRef.current && readyState === WebSocket.OPEN) {
            console.log("SEND MESSAGE", content);
            socketRef.current.send(JSON.stringify({type, content}));
        }
    }, [readyState, socketRef.current])

    const closeConnection = () => {
        if(socketRef.current) {
            socketRef.current.close();
        }
            
    }

    return {sendMessage, openConnection, closeConnection, readyState}
}

export default useWebsocket;