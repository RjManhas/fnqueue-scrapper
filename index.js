/* eslint-disable no-restricted-syntax */
import { io } from 'socket.io-client';

// Connect to the server via WebSocket
const socket = io('https://fnqueue.com/'); // Replace with the correct server URL

// Function to format seconds into HH:MM:SS
function formatSeconds(seconds) {
    return new Date(seconds * 1000)
        .toISOString()
        .slice(11, 19)
        .replace(/^(00:)+/, '');
}

// Function to handle the server data
function handleServerData(data) {
    if (!data) {
        console.log("No data received.");
        return;
    }

    console.info('Received server data:', data);

    const serverStatus = {
        current: {
            status: data.server?.current?.isUp ? 'Online' : 'Offline',
            message: data.server?.current?.message || 'Unknown',
            lastModified: data.server?.current?.lastModified
                ? new Date(data.server.current.lastModified).toLocaleString()
                : 'Unknown',
        },
        scheduled: {
            downtimeStart: data.server?.scheduled?.downtimeStart
                ? new Date(data.server.scheduled.downtimeStart).toLocaleString()
                : 'Unknown',
            lastModified: data.server?.scheduled?.lastModified
                ? new Date(data.server.scheduled.lastModified).toLocaleString()
                : 'Unknown',
        },
    };

    const queueStatus = {
        current: {
            enabled: data.queue?.current?.enabled ? 'Enabled' : 'Disabled',
            time: data.queue?.current?.time ? formatSeconds(data.queue.current.time) : 'None',
            lastModified: data.queue?.current?.lastModified
                ? new Date(data.queue.current.lastModified).toLocaleString()
                : 'Unknown',
        },
        highest: {
            time: data.queue?.highest?.time ? formatSeconds(data.queue.highest.time) : 'Unknown',
            lastModified: data.queue?.highest?.lastModified
                ? new Date(data.queue.highest.lastModified).toLocaleString()
                : 'Unknown',
        },
    };

    const backgroundUrl = data.background?.url || 'Default background URL';

    console.log({
        serverStatus,
        queueStatus,
        backgroundUrl,
    });
}

// Listen for incoming server data updates from the WebSocket
socket.on('status', handleServerData);

// Set an interval to emit a request for the server data every 3 seconds