const express = require('express');
const fs = require('fs');
const tasksRouter = express.Router();

tasksRouter.post('/', (req, res) => {
    let newTask = req.body;

    fs.readFile('tasks.json', 'utf-8', (err, data) => {
        if (err) {
            console.log('File does not exist');
            return res.status(500).send('Internal server error');
        }
        let tasks = [];

        try {
            tasks = JSON.parse(data);
            tasks.push(newTask);

            fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), (err) => {
                if (err) {
                    console.log('Error writing to file');
                    return res.status(500).send('Internal server error');
                }
                res.status(201).json({ message: 'Task created' });
            });
        } catch (err) {
            console.log('Something went wrong while parsing data');
            res.status(500).send('Internal server error');
        }
    });
});

tasksRouter.get('/', (req, res) => {
    fs.readFile('tasks.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal server error');
        }
        try {
            let tasks = JSON.parse(data);
            res.status(200).json(tasks);
        } catch (err) {
            console.log(err);
            res.status(500).send('Internal server error');
        }
    });
});

tasksRouter.get('/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('tasks.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal server error');
        }
        try {
            let tasks = JSON.parse(data);
            let ts = tasks.find(ts => ts.id == id);
            if (!ts) {
                return res.status(404).send('Not Found');
            }
            res.status(200).json(ts);
        } catch (err) {
            console.log('Something went wrong while parsing data');
            res.status(500).send('Internal server error');
        }
    });
});

tasksRouter.put('/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('tasks.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal server error');
        }
        try {
            let tasks = JSON.parse(data);
            let taskIndex = tasks.findIndex(ts2 => ts2.id == id);
            if (taskIndex === -1) {
                return res.status(404).send('Not Found');
            }
            tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
            fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), (err) => {
                if (err) {
                    console.log('Error writing to file');
                    return res.status(500).send('Internal server error');
                }
                res.status(200).json({ message: 'Updated' });
            });
        } catch (err) {
            console.log('Something went wrong while parsing data');
            res.status(500).send('Internal server error');
        }
    });
});

tasksRouter.delete('/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('tasks.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal server error');
        }
        try {
            let tasks = JSON.parse(data);
            let taskIndex = tasks.findIndex(ts2 => ts2.id == id);
            if (taskIndex === -1) {
                return res.status(404).send('Not Found');
            }
            tasks.splice(taskIndex, 1);
            fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), (err) => {
                if (err) {
                    console.log('Error writing to file');
                    return res.status(500).send('Internal server error');
                }
                res.status(200).json({ message: 'Deleted' });
            });
        } catch (err) {
            console.log('Something went wrong while parsing data');
            res.status(500).send('Internal server error');
        }
    });
});

module.exports = tasksRouter;
