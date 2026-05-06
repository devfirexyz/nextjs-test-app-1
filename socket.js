/* eslint-disable @typescript-eslint/no-require-imports */
const {createServer} = require("node:http")
const {Server} = require("socket.io")

const port = 3001

const mockUsers = [
    {id: "guest-1", role: "guest"},
    {id: "trader-1", role: "trader"},
    {id: "admin-1", role: "admin"},
];

const marketState = {
    "wti-crude-may-2026": [
        {id: "oil-95", probability: 75},
        {id: "oil-100", probability: 91},
        {id: "oil-90", probability: 57},
        {id: "oil-85", probability: 41},
    ],
    "btc-up-down-5m": [{id: "btc-up", probability: 51}],
    "iran-airspace": [
        {id: "iran-may-31", probability: 45},
        {id: "iran-may-8", probability: 18},
    ],
    "us-iran-peace": [
        {id: "peace-dec-31", probability: 63},
        {id: "peace-jun-30", probability: 34},
    ],
};

function parseMockToken(token) {
    if (!token) return null;

    const [scheme, role, userId] = token.split(":");

    if (scheme !== "mock") return null;

    return mockUsers.find((user) => user.id === userId && user.role === role) ?? null
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function nextProbability(value) {
    const drift = Math.round((Math.random() - 0.48) * 6)
    return clamp(value + drift, 1, 99)
}

const httpServer = createServer()

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    },
    pingInterval: 25000,
    pingTimeout: 20000,
})

io.use((socket, next) => {
    console.log("handshake token", socket.handshake.auth.token);

    const user = parseMockToken(socket.handshake.auth.token)
    if (!user) {
        next(new Error("Authentication required"))
        return;
    }

    socket.data.user = user;
    next();
})

io.on("connection", (socket) => {
    console.log("connected", socket.id, socket.data.user)

    socket.on("market:join", (marketId) => {
        if (!marketState[marketId]) return;
        socket.join(`market:${marketId}`)
        socket.emit("market:snapshot", {
            marketId,
            outcomes: marketState[marketId],
        })
    })

    socket.on("market:leave", (marketId) => {
        socket.leave(`market:${marketId}`)
    })

    socket.on("disconnect", (reason) => {
        console.log("disconnected", socket.id, reason);
    })
})

setInterval(() => {
    for (const marketId of Object.keys(marketState)) {
        marketState[marketId] = marketState[marketId].map((outcome) => ({
            ...outcome,
            probability: nextProbability(outcome.probability)
        }))

        io.to(`market:${marketId}`).emit("market:update", {
            marketId,
            outcomes: marketState[marketId],
            updatedAt: Date.now(),
        })
    }
}, 2000)

httpServer.listen(port, () => {
    console.log(`Socket.IO server ready on http://localhost:${port}`);
})
