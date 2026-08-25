require('dotenv').config()

const express = require('express');

const app = express()
const PORT = process.env.PORT || 3001;

const jwt = require("jsonwebtoken");


const users = [
    {
        id: 1,
        username: "Ivan",
        password: 'password1'
    },
    {
        id: 2,
        username: "Anna",
        password: 'password2'
    }, {
        id: 3,
        username: "Roma",
        password: 'password3'
    }, {
        id: 4,
        username: "Andrei",
        password: 'password4'
    }, {
        id: 5,
        username: "Noah",
        password: 'password5'
    }
]

const messages = [
    {
        id: 1,
        senderId: 1,
        receiverId: 2,
        text: 'Yknow who else may cry?',
        createdAt: Date.now()
    }, {
        id: 2,
        senderId: 2,
        receiverId: 1,
        text: 'The devil',
        createdAt: Date.now()
    }
]

const matches = [
    {
        id: 1,
        firstPlayer: {
            id: 1,
            choice: null
        },
        secondPlayer: {
            id: 2,
            choice: null
        },
        winner: {
            id: 1,
            username: 'Ivan'
        },
        date: Date.now(),
        chat: [
            {
                id: 1,
                senderId: 1,
                receiverId: 2,
                text: 'Yknow who else may cry?',
                createdAt: Date.now()
            }
        ]
    }
]

const JWT_SECRET = process.env.JWT_SECRET

app.use(express.json())

function createToken(user) {
    return jwt.sign(
        {
            id: user.id
        },
        JWT_SECRET,
        {
            expiresIn: '1hr'
        }
    )
}
function getToken(req) {
    const auth = req.headers.authorization;

    if (!auth) {
        return null;
    }

    return auth.split(' ')[1];
}

function getUser(req) {
    const token = getToken(req)
    if (!token) {
        return null
    }
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = users.find(user => user.id === decoded.id)
    return user
}

function getSelectedUser(req) {
    let selectedUser = null
    if (!req.params.userId) {
        const { selectedUserId } = req.body
        selectedUser = users.find(user => user.id === Number(selectedUserId))
    } else {
        selectedUser = users.find(user => user.id === Number(req.params.userId))
    }
    return selectedUser
}

function getMatch(req) {
    const matchId = Number(req.params.matchId)
    const currentMatch = matches.find(match => match.id === matchId)
    return currentMatch
}

function chooseWinner(firstPlayer, secondPlayer, matchId) {
    const winAgainst = {
        rock: 'scissors',
        scissors: 'paper',
        paper: 'rock'
    }

    if (firstPlayer.choice === secondPlayer.choice) {
        console.log('draw')
        return null
    } else if (winAgainst[firstPlayer.choice] === secondPlayer.choice) {
        console.log('winner', firstPlayer.id)
        return firstPlayer.id
    } else {
        console.log('winner', secondPlayer.id)
        return secondPlayer.id
    }

}

app.get('/api/matches', (req, res) => {
    const publicInfo = matches.map(match => ({
        match
    }))
    res.json(publicInfo)
})

app.get('/api/me', (req, res) => {
    try {
        const user = getUser(req)

        if (!user) {
            console.log('wrong token')
            return res.status(401).json({
                message: 'User not found',
                isTokenWorking: false
            })
        }
        console.log('all good')
        res.json({
            isTokenWorking: true
        })
    } catch (err) {
        return res.status(401).json({
            message: 'Invalid or expired token',
            isTokenWorking: false
        });
    }
})

app.get("/api/users", (req, res) => {
    const publicInfo = users.map(user => ({
        id: user.id,
        username: user.username
    }))
    res.json(publicInfo)
});

app.get('/api/user/:userId', (req, res) => {
    const selectedUser = getSelectedUser(req)
    res.json(
        {
            id: selectedUser.id,
            username: selectedUser.username
        }
    )
})

app.post('/api/login', (req, res) => {
    const { username, password } = req.body

    const user = users.find(user => user.username === username && user.password === password)

    if (!user) {
        return res.status(401).json({
            message: 'Inccorect username or password!'
        })
    }

    const token = createToken(user)


    res.json({
        message: 'Succesfull login!',
        token,
        user: {
            username: user.username,
        }
    })
})

app.post('/api/singup', (req, res) => {
    const { username, password } = req.body
    const newId = Math.max(...users.map(user => user.id)) + 1
    const newUser = {
        id: newId,
        username,
        password
    }
    users.push(newUser)
    console.log('new user created', newUser)
    const token = createToken(newUser)

    res.status(201).json({
        message: 'Sing up succesfull',
        token,
        user: {
            username: newUser.username,
        }
    })
})

app.get('/api/usersforchat', (req, res) => {

    try {
        const currentUser = getUser(req)
        const publicUsers = users.filter(user => user.id !== currentUser.id).map(({ id, username }) =>
        ({
            id,
            username
        }))

        if (!currentUser) {
            res.status(404).json({
                message: 'User not found'
            })
        }
        res.json({
            currentUser: {
                id: currentUser.id,
                username: currentUser.username
            },
            users: publicUsers
        })
    } catch (error) {
        res.status(401).json({
            message: 'Invalid token'
        })
    }
})

app.get("/api/messages/:userId", (req, res) => {
    const selectedUser = getSelectedUser(req)
    console.log(selectedUser)

    try {
        const currentUser = getUser(req)

        const chat = messages.filter(message =>
            (message.senderId === selectedUser.id &&
                message.receiverId === currentUser.id) ||

            (message.senderId === currentUser.id &&
                message.receiverId === selectedUser.id)
        );
        res.json(chat)
    } catch {
        res.status(401).json({
            message: 'Invalid token'
        })
    }
})

app.post('/api/sendmessage/:userId', (req, res) => {
    const receiverId = Number(req.params.userId)
    const { text } = req.body

    try {
        const currentUser = getUser(req)
        const newMessageId = messages.length > 0
            ? Math.max(...messages.map(message => message.id)) + 1
            : 1
        const message = {
            id: newMessageId,
            senderId: currentUser.id,
            receiverId: receiverId,
            text,
            createdAt: Date.now()

        }
        messages.push(message)
        res.status(201).json(message)
    } catch (err) {
        res.status(401).json({
            message: 'Invalid token'
        })
    }
})

app.get('/api/match/:matchId/chat', (req, res) => {
    const currentMatch = getMatch(req)
    console.log(currentMatch)
    const chat = matches.find(match => match.id === currentMatch.id)?.chat
    res.json({
        chat: chat,
        isMatchOver: currentMatch.winner.id !== null || currentMatch.winner.id === 'draw'
            ? true
            : false
    })
})

app.post('/api/match/:matchId/sendmessage', (req, res) => {
    const currentMatch = getMatch(req)
    const currentUser = getUser(req)
    const selectedUserId = currentMatch.firstPlayer?.id !== currentUser.id
        ? currentMatch.firstPlayer?.id
        : currentMatch.secondPlayer?.id
    const { text } = req.body

    const newMessageId = messages.length > 0
        ? Math.max(...messages.map(message => message.id)) + 1
        : 1
    const message = {
        id: newMessageId,
        senderId: currentUser.id,
        receiverId: selectedUserId,
        text,
        createdAt: Date.now()

    }
    currentMatch.chat.push(message)
    res.status(201).json(message)

})

app.post('/api/checkPlayerMatches', (req, res) => {
    try {
        const currentUser = getUser(req)
        const selectedUser = getSelectedUser(req)
        const unfinishedMatch = matches.find(match =>
            match.winner.id === null &&
            (
                match.firstPlayer.id === currentUser.id
                || match.secondPlayer.id === currentUser.id
            ) &&
            (
                match.firstPlayer.id === selectedUser.id
                || match.secondPlayer.id === selectedUser.id
            )
        )
        if (!unfinishedMatch) {
            const newMatchId = Math.max(...matches.map(user => user.id)) + 1
            const match = {
                id: newMatchId,
                firstPlayer: {
                    id: currentUser.id,
                    choice: null
                },
                secondPlayer: {
                    id: selectedUser.id,
                    choice: null
                },
                winner: {
                    id: null,
                    username: null
                },
                date: Date.now(),
                chat: []
            }
            matches.push(match)
            console.log(matches)
            return res.json({
                match: match,
                created: true
            });
        }

        return res.json({
            match: unfinishedMatch,
            created: false
        });
    } catch (err) {
        console.log(err)
    }

})


function checkChoice(match, player) {
    return match.firstPlayer.id === player.id
        ? match.firstPlayer.choice
        : match.secondPlayer.choice
}
app.get('/api/match/:matchId', (req, res) => {
    const currentMatch = getMatch(req)

    try {
        const currentUser = getUser(req)
        const opponentId = currentMatch.firstPlayer?.id === currentUser.id
            ? currentMatch.secondPlayer.id
            : currentMatch.firstPlayer.id
        const opponent = users.find(user => user.id === opponentId)
        res.json({
            opponent: {
                id: opponent.id,
                username: opponent.username,
                choice: checkChoice(currentMatch, opponent)
            },
            currentPlayer: {
                id: currentUser.id,
                username: currentUser.username,
                choice: checkChoice(currentMatch, currentUser)
            }
            ,
            winner: currentMatch.winner.username
        })
    } catch (err) {
        console.log(err)
    }

})

app.post('/api/match/:matchId', (req, res) => {
    const currentMatch = getMatch(req)

    if (!currentMatch) {
        res.status(404).json({
            messages: 'Match not found'
        })
    }

    const choice = req.body.choice
    const currentUser = getUser(req)
    try {
        if (currentUser.id === currentMatch.firstPlayer.id) {
            currentMatch.firstPlayer.choice = choice
            console.log(`player ${users.find(user => user.id === currentMatch.firstPlayer.id).username} made choice`)
            if (
                currentMatch.firstPlayer.choice !== null
                && currentMatch.secondPlayer.choice !== null
            ) {
                const matchWinner = users.find(user => user.id === chooseWinner(currentMatch.firstPlayer, currentMatch.secondPlayer))
                currentMatch.winner.id = matchWinner?.id ?? 'draw'
                currentMatch.winner.username = matchWinner?.username ?? 'draw'
                return res.json({
                    winner: currentMatch.winner ?? null
                })
            }
            res.json({
                messages: 'Choice saved'
            })
        } else if (currentUser.id === currentMatch.secondPlayer.id) {
            currentMatch.secondPlayer.choice = choice
            console.log(`player ${users.find(user => user.id === currentMatch.secondPlayer.id).username} made choice`)
            if (
                currentMatch.firstPlayer.choice !== null
                && currentMatch.secondPlayer.choice !== null
            ) {
                const matchWinner = users.find(user => user.id === chooseWinner(currentMatch.firstPlayer, currentMatch.secondPlayer))
                currentMatch.winner.id = matchWinner?.id ?? 'draw'
                currentMatch.winner.username = matchWinner?.username ?? 'draw'
                return res.json({
                    winner: currentMatch.winner ?? null
                })
            }
            res.status(201).json({
                messages: 'Choice saved'
            })
        } else {
            return res.status(403).json({
                messages: 'This user dont take place in this match!'
            })
        }

    } catch (err) {
        console.log(err)
    }
})

app.listen(PORT, () => {
    console.log(__dirname);
    console.log(`Server started on http://localhost:${PORT}`)
})