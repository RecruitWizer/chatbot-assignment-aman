import { createClient } from 'redis';

const client = createClient({
    // url: `redis://${process.env.REDIS_CLIENT_HOST}:${process.env.REDIS_CLIENT_PORT}`,
    password: process.env.REDIS_PW,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        // connectTimeout: 50000,
        // tls: true
    },
    // pingInterval: 1000,
    // legacyMode: false,
});

client.on('error', (err) => console.log(err));

if (!client.isOpen) {
    client.connect();
}

export { client }