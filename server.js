// server.js
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');

// Create an express app
const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Mock database (in-memory store)
let books = [
  { isbn: '9783161484100', title: 'The Book of Node', author: 'John Doe', reviews: {} },
  { isbn: '9781234567897', title: 'Learning APIs', author: 'Jane Smith', reviews: {} },
];
let users = [];
let loggedInUsers = {}; // Store logged-in user tokens

// Route to get all books
app.get('/books', (req, res) => {
  res.json(books);
});

// Route to get a book by ISBN
app.get('/books/isbn/:isbn', (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Route to get books by Author
app.get('/books/author/:author', (req, res) => {
  const booksByAuthor = books.filter(b => b.author.toLowerCase() === req.params.author.toLowerCase());
  res.json(booksByAuthor);
});

// Route to get books by Title
app.get('/books/title/:title', (req, res) => {
  const booksByTitle = books.filter(b => b.title.toLowerCase().includes(req.params.title.toLowerCase()));
  res.json(booksByTitle);
});

// Route to get book reviews
app.get('/books/review/:isbn', (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Route to register a new user
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const newUser = { username, password, id: uuid.v4() };
  users.push(newUser);
  res.json({ message: 'User registered successfully' });
});

// Route to log in a user and get a token
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const token = uuid.v4();
    loggedInUsers[token] = username;
    res.json({ message: 'Login successful', token });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Middleware for authentication using token
function authenticate(req, res, next) {
  const token = req.headers['x-user'];
  if (token && loggedInUsers[token]) {
    req.username = loggedInUsers[token];
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

// Route to add or modify a book review
app.put('/books/review/:isbn', authenticate, (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const book = books.find(b => b.isbn === isbn);
  if (book) {
    book.reviews[req.username] = review;
    res.json({ message: 'Review added/modified', reviews: book.reviews });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Route to delete a book review
app.delete('/books/review/:isbn', authenticate, (req, res) => {
  const { isbn } = req.params;
  const book = books.find(b => b.isbn === isbn);
  if (book && book.reviews[req.username]) {
    delete book.reviews[req.username];
    res.json({ message: 'Review deleted', reviews: book.reviews });
  } else {
    res.status(404).json({ message: 'Review not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
