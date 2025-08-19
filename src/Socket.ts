import { io, Socket } from "socket.io-client";

export var socket: Socket;

export const initSocket = (): void => {
    console.log('Initialing socket ...', process.env.NEXT_PUBLIC_SOCKET_URL);

    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
        path: "/clients/socketio/hubs/Centro",
        autoConnect: true,
        reconnection: true,
        query: {
            token: 'hello'
        }
    });

    const onConnect = () => {
        console.log('Socket connected!');
    };

    const keyUp = () => {
        console.log('Key UP!');
    };

    const keyDown = () => {
        console.log('Key DOWN!');
    };
    
    const onDisconnect = () => {
        console.log('Socket disconnected!');
    };

    socket.on('connect', onConnect);
    socket.on('keyUp', keyUp);
    socket.on('keyDown', keyDown);
    socket.on('disconnect', onDisconnect);

};
