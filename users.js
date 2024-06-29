const express = require('express')
const userRouter = express.Router()
const fs = require('fs')

userRouter.post('/', (req, res) => {
    let newUser = req.body

    fs.readFile('users.json', 'utf-8', (err, data) => {
        if (err) {
            console.log('File does not exist');
            return res.status(500).send('Internal server error')
        }
        let users = []

        try {
            users = JSON.parse(data)
            users.push(newUser)

            fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    console.log('Error writing to file')
                    return res.status(500).send('Internal server error')
                }
                return res.status(201).send({ message: 'User created' })
            })
        } catch (err) {
            console.log('Something went wrong while parsing data');
        }
    })
})

userRouter.get('/', (req, res) => {
    fs.readFile('users.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal server error')
        }
        let users = []
        try {
            users = JSON.parse(data)
            return res.status(200).send(users)
        } catch (err) {
            console.log('Something went wrong while parsing data');
        }
    })
})

userRouter.get(`/:userId`, (req, res) => {
    const id = req.params.userId
    fs.readFile('users.json', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal server error')
        }
        let users = []
        try {
            users = JSON.parse(data)
            let person = users.find(us => us.userId == id)
            if (!person) {
                return res.status(404).send('Not Found')
            }
            res.status(200).send(person)
        } catch (err) {
            console.log('Something went wrong while parsing data');
        }
    })
})

userRouter.put(`/:userId`, (req, res) => {
    const id = req.params.userId
    fs.readFile('users.json', (err, data) => {
        try {
            if (err) {
                throw { status: 500, message: "Internal server error" }
            }
            let users = JSON.parse(data)
            let person = users.find(us => us.userId == id)
            if (!person) {
                return res.status(404).send('Not Found')
            }
            person = { ...person, ...req.body }
            users = users.map(us => us.userId == id ? person : us)
            fs.writeFile('users.json', JSON.stringify(users), (err) => {
                if (err) {
                    throw { status: 500, message: "Internal server error" }
                }
                return res.status(200).send('Updated')
            })
        } catch ({ status, message }) {
            return res.status(status).send(message)
        }
    })
})

userRouter.delete(`/:userId`, (req, res) => {
    const id = req.params.userId
    fs.readFile('users.json', (err, data) => {
        try {
            if (err) {
                throw { status: 500, message: "Internal server error" }
            }
            let users = JSON.parse(data)
            let person = users.find(us => us.userId == id)
            if (!person) {
                return res.status(404).send('Not Found')
            }
            users = users.filter(us => us.userId != id)
            fs.writeFile('users.json', JSON.stringify(users), (err) => {
                if (err) {
                    throw { status: 500, message: "Internal server error" }
                }
                return res.status(200).send('Deleted')
            })
        } catch ({ status, message }) {
            return res.status(status).send(message)
        }
    })
})

module.exports = userRouter