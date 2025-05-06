const axios = require('axios');

// Task 6: Register New User
async function registerNewUser() {
  try {
    const response = await axios.post('http://localhost:5000/register', {
      username: 'user1',
      password: 'password123',
    });
    console.log('Registration response:', response.data);
  } catch (error) {
    console.error('Error registering user:', error.message);
  }
}

// Task 7: Login as Registered User
async function loginUser() {
  try {
    const response = await axios.post('http://localhost:5000/login', {
      username: 'user1',
      password: 'password123',
    });
    console.log('Login response:', response.data);
    return response.data.token; // Save the token to use in the header
  } catch (error) {
    console.error('Error logging in:', error.message);
  }
}

// Task 1: Get all books
async function getAllBooks() {
  try {
    const response = await axios.get('http://localhost:5000/books');
    console.log('Books:', response.data);
  } catch (error) {
    console.error('Error fetching all books:', error.message);
  }
}

// Task 2: Get a book by ISBN
async function getBookByIsbn(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/books/isbn/${isbn}`);
    console.log('Book:', response.data);
  } catch (error) {
    console.error('Error fetching book by ISBN:', error.message);
  }
}

// Task 3: Get books by Author
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/books/author/${author}`);
    console.log('Books by Author:', response.data);
  } catch (error) {
    console.error('Error fetching books by author:', error.message);
  }
}

// Task 4: Get books by Title
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:5000/books/title/${title}`);
    console.log('Books by Title:', response.data);
  } catch (error) {
    console.error('Error fetching books by title:', error.message);
  }
}

// Task 5: Get Book Reviews
async function getBookReviews(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/books/review/${isbn}`);
    console.log('Reviews:', response.data);
  } catch (error) {
    console.error('Error fetching book reviews:', error.message);
  }
}

// Task 8: Add/Modify a Book Review
async function addReview(token) {
  try {
    const response = await axios.put('http://localhost:5000/books/review/9783161484100', {
      review: 'This is an amazing book on Node.js!',
    }, {
      headers: {
        'x-user': token,
      },
    });
    console.log('Review added/modified:', response.data);
  } catch (error) {
    console.error('Error adding/modifying review:', error.message);
  }
}

// Task 9: Delete Book Review
async function deleteReview(token) {
  try {
    const response = await axios.delete('http://localhost:5000/books/review/9783161484100', {
      headers: {
        'x-user': token,
      },
    });
    console.log('Review deleted:', response.data);
  } catch (error) {
    console.error('Error deleting review:', error.message);
  }
}

// Running all tasks
async function run() {
  // Register a new user
  await registerNewUser();

  // Log in and get token
  const token = await loginUser();

  // Perform tasks
  await getAllBooks();
  await getBookByIsbn('9783161484100');
  await getBooksByAuthor('John Doe');
  await getBooksByTitle('Node');
  await getBookReviews('9783161484100');
  await addReview(token);
  await deleteReview(token);
}

run();
