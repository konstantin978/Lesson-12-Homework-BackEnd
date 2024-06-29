const express = require('express');
const projectsRouter = express.Router();
const fs = require('fs');

projectsRouter.post('/', (req, res) => {
    let newProject = req.body;

    fs.readFile('projects.json', 'utf-8', (err, data) => {
        if (err) {
            console.log('File does not exist');
            return res.status(500).send('Internal server error');
        }
        let projects = [];

        try {
            projects = JSON.parse(data);
            projects.push(newProject);

            fs.writeFile('projects.json', JSON.stringify(projects, null, 2), (err) => {
                if (err) {
                    console.log('Error writing to file');
                    return res.status(500).send('Internal server error');
                }
                return res.status(201).send({ message: 'Project created' });
            });
        } catch (err) {
            console.log('Something went wrong while parsing data');
            return res.status(500).send('Internal server error');
        }
    });
});

projectsRouter.get('/', (req, res) => {
    fs.readFile('projects.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal server error');
        }
        let projects = [];
        try {
            projects = JSON.parse(data);
            return res.status(200).send(projects);
        } catch (err) {
            console.log('Something went wrong while parsing data');
            return res.status(500).send('Internal server error');
        }
    });
});

projectsRouter.get('/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('projects.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal server error');
        }
        try {
            let projects = JSON.parse(data);
            let project = projects.find(pr => pr.id == id);
            if (!project) {
                return res.status(404).send('Not Found');
            }
            res.status(200).send(project);
        } catch (err) {
            console.log('Something went wrong while parsing data');
            return res.status(500).send('Internal server error');
        }
    });
});

projectsRouter.put('/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('projects.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal server error');
        }
        try {
            let projects = JSON.parse(data);
            let projectIndex = projects.findIndex(pr => pr.id == id);
            if (projectIndex === -1) {
                return res.status(404).send('Not Found');
            }
            projects[projectIndex] = { ...projects[projectIndex], ...req.body };
            fs.writeFile('projects.json', JSON.stringify(projects, null, 2), (err) => {
                if (err) {
                    console.log('Error writing to file');
                    return res.status(500).send('Internal server error');
                }
                return res.status(200).send({ message: 'Updated' });
            });
        } catch (err) {
            console.log('Something went wrong while parsing data');
            return res.status(500).send('Internal server error');
        }
    });
});

projectsRouter.delete('/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('projects.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal server error');
        }
        try {
            let projects = JSON.parse(data);
            let projectIndex = projects.findIndex(pr => pr.id == id);
            if (projectIndex === -1) {
                return res.status(404).send('Not Found');
            }
            projects.splice(projectIndex, 1);
            fs.writeFile('projects.json', JSON.stringify(projects, null, 2), (err) => {
                if (err) {
                    console.log('Error writing to file');
                    return res.status(500).send('Internal server error');
                }
                return res.status(200).send({ message: 'Deleted' });
            });
        } catch (err) {
            console.log('Something went wrong while parsing data');
            return res.status(500).send('Internal server error');
        }
    });
});

module.exports = projectsRouter;