let express = require('express');
let bodyParser = require('body-parser');
let expressApp = express();
const fs = require('fs');
const mongo = require('./mongo.js');

expressApp.use(bodyParser.json());

expressApp.get('/', (req, res) => {
    res.send('Hello World!');
});

expressApp.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// Create todo
expressApp.post('/todo', async (req, res) => {
    let todo = req.body;
    if (!todo.text) {
        res.status(400).json({ error: 'Text is required' });
        return;
    }
    if (todo.completed && typeof todo.completed !== 'boolean') {
        res.status(400).json({ error: 'Completed must be a boolean' });
        return;
    }
    let newTodo = {
        text: todo.text,
        completed: todo.completed || false
    };
    try {
        const createdTodo = await mongo.createTodo(newTodo);
        res.json(createdTodo);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the todo' });
    }
});

// Update todo
expressApp.put('/todo/:id', async (req, res) => {
    const id = req.params.id;
    const update = req.body;
    try {
        const updatedTodo = await mongo.updateTodo(id, update);
        if (!updatedTodo) {
            res.status(404).json({ error: 'Todo not found' });
            return;
        }
        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the todo' });
    }
});

// Delete todo
expressApp.delete('/todo/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deletedTodo = await mongo.deleteTodo(id);
        if (!deletedTodo) {
            res.status(404).json({ error: 'Todo not found' });
            return;
        }
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the todo' });
    }
});

// Get all todos
expressApp.get('/todos', async (req, res) => { 
    try {
        const todos = await mongo.getTodos();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching todos' });
    }
});

// Get a specific todo by id 
expressApp.get('/todo/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const todo = await mongo.getTodo(id);
        if (!todo) {
            res.status(404).json({ error: 'Todo not found' });
            return;
        }
        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the todo' });
    }
});
