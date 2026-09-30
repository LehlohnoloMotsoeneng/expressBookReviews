const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(201).json({
    message: "User successfully registered"
  });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = {};

  Object.keys(books).forEach((key) => {
    if (books[key].author === author) {
      booksByAuthor[key] = books[key];
    }
  });

  return res.status(200).json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = {};

  Object.keys(books).forEach((key) => {
    if (books[key].title === title) {
      booksByTitle[key] = books[key];
    }
  });

  return res.status(200).json(booksByTitle);
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});

// --------------------------------------------------
// Task 11: Axios + async/await implementations
// --------------------------------------------------

// Retrieve all books using Axios
async function getAllBooksWithAxios() {
  const response = await axios.get('http://localhost:5000/');
  return response.data;
}

// Retrieve a book by ISBN using Axios
async function getBookByISBNWithAxios(isbn) {
  const response = await axios.get(
    `http://localhost:5000/isbn/${encodeURIComponent(isbn)}`
  );
  return response.data;
}

// Retrieve books by author using Axios
async function getBooksByAuthorWithAxios(author) {
  const response = await axios.get(
    `http://localhost:5000/author/${encodeURIComponent(author)}`
  );
  return response.data;
}

// Retrieve books by title using Axios
async function getBooksByTitleWithAxios(title) {
  const response = await axios.get(
    `http://localhost:5000/title/${encodeURIComponent(title)}`
  );
  return response.data;
}

// Task 11 demonstration endpoint
public_users.get('/axios-test', async function (req, res) {
  try {
    const allBooks = await getAllBooksWithAxios();

    return res.status(200).json({
      message: "Books retrieved successfully using Axios and async/await",
      books: allBooks
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve books using Axios"
    });
  }
});

// Task 11: Axios retrieval by ISBN
public_users.get('/axios/isbn/:isbn', async function (req, res) {
  try {
    const book = await getBookByISBNWithAxios(req.params.isbn);

    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({
      message: "Book not found"
    });
  }
});

// Task 11: Axios retrieval by author
public_users.get('/axios/author/:author', async function (req, res) {
  try {
    const result = await getBooksByAuthorWithAxios(req.params.author);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({
      message: "Books by author not found"
    });
  }
});

// Task 11: Axios retrieval by title
public_users.get('/axios/title/:title', async function (req, res) {
  try {
    const result = await getBooksByTitleWithAxios(req.params.title);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({
      message: "Books by title not found"
    });
  }
});

module.exports.general = public_users;
