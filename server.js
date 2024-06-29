const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3001

const userRouter = require('./users.js')
const tasksRouter = require('./tasks.js')
const projectsRouter = require('./projects.js')
app.use(bodyParser.json())

// app.use((req, res, next) => {
//     console.log(req.method);
//     console.log(req.url);
//     next();
// })

// Resources
// 1. projects
// 2. users
// 3. tasks



// Projects

app.use('/users', userRouter)
app.use('/tasks', tasksRouter)
app.use('/projects', projectsRouter)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})