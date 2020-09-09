const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const randomstring = require("randomstring");
//const mongodb = require("mongodb");
const mongoose = require("mongoose");
const Author = require("./models/Author.js");
const Book = require("./models/Book.js");
const { dirname } = require("path");

const app = express();

app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("images"));
app.use(express.static("css"));

app.listen(8080);

const url = "mongodb://localhost:27017/librarydb";

// let db;
mongoose.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },

    function (err) {
        if (err) {
            console.log("Error ", err);
        } else {
            console.log("Connected successfully to server");
        }
    }
);

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
});

app.get("/getallbooks", function (req, res) {
    Book.find({})
        .populate("author")
        .exec(function (err, data) {
            if (err) {
                res.redirect("/getallbooks");
            } else {
                console.log(data);
                res.render(__dirname + "/views/getBooks.html", { books: data });
            }
        });
});

app.get("/getallauthors", function (req, res) {
    Author.find({}, function (err, data) {
        if (err) {
            res.redirect("/getallauthors");
        } else {
            res.render(__dirname + "/views/getAuthors.html", { authors: data });
        }
    });
});

app.get("/addbook", function (req, res) {
    const isbn = randomstring.generate({ length: 13, charset: "numeric" });
    res.render(__dirname + "/views/addBook.html", { isbn: isbn });
});

app.get("/addauthor", function (req, res) {
    res.sendFile(__dirname + "/views/addAuthor.html");
});

app.get("/updatebook", function (req, res) {
    res.sendFile(__dirname + "/views/updateBook.html");
});

app.get("/updateauthor", function (req, res) {
    res.sendFile(__dirname + "/views/updateAuthor.html");
});

app.get("/deletebook", function (req, res) {
    res.sendFile(__dirname + "/views/deleteBook.html");
});

app.post("/addbook", function (req, res) {
    const book = req.body;
    let newBook = new Book({
        _id: new mongoose.Types.ObjectId(),
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        date: book.dop,
        summary: book.summary,
    });
    newBook.save(function (err) {
        if (err) {
            res.redirect("/addbook");
        } else {
            console.log(newBook.author);
            Author.updateOne(
                { _id: newBook.author },
                { $inc: { numBooks: 1 } },
                function (err, response) {
                    if (err) {
                        res.redirect("/addbook");
                    } else {
                        console.log(response);
                        res.redirect("/getallbooks");
                    }
                }
            );
        }
    });
});

app.post("/addauthor", function (req, res) {
    const author = req.body;
    let newAuthor = new Author({
        _id: new mongoose.Types.ObjectId(),
        name: { firstName: author.fname, lastName: author.lname },
        dob: author.dob,
        address: {
            state: author.state,
            suburb: author.suburb,
            street: author.street,
            unit: author.unit,
        },
        numBooks: parseInt(author.nob),
    });
    newAuthor.save(function (err) {
        if (err) {
            res.redirect("/addauthor");
        } else {
            res.redirect("/getallauthors");
        }
    });
});

app.post("/deletebook", function (req, res) {
    const isbn = req.body.isbn;
    Book.deleteOne({ isbn: isbn }, function (err, result) {
        if (err) {
            res.redirect("/deletebook");
        } else {
            res.redirect("/getallbooks");
        }
    });
});

app.post("/updatebook", function (req, res) {
    const book = req.body;
    Book.updateOne(
        { isbn: book.isbn },
        {
            title: book.title,
            author: book.author,
            date: book.dop,
            summary: book.summary,
        },
        function (err, result) {
            if (err) {
                res.redirect("/updatebook");
            } else {
                res.redirect("/getallbooks");
            }
        }
    );
});

app.post("/updateauthor", function (req, res) {
    const author = req.body;
    Author.updateOne(
        { _id: author.id },
        {
            numBooks: author.nob,
        },
        function (err, result) {
            if (err) {
                res.redirect("/updateauthor");
            } else {
                res.redirect("getallauthors");
            }
        }
    );
});

app.get(/.*/, function (req, res) {
    res.sendFile(__dirname + "/views/Error.html");
});
