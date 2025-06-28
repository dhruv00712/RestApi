const express = require('express');
const app = express();
const port = 3000;

const asyncLogger = async (req, res, next) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Async Logger: ${req.method} ${req.originalUrl}`);
    next();
  } catch (err) {
    next(err);
  }
};

app.use(asyncLogger);
app.use(express.json());

let users = [];

app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser = { id: users.length + 1, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

app.get('/users', async (req, res) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;

    await new Promise(resolve => setTimeout(resolve, 500));
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    users.splice(index, 1);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
