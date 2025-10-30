const express = require('express');
const session = require('express-session');
const hbs = require('hbs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 74;

// Setting up Handlebars
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'abcdefghijklmnopqrstuvwxyz',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
    }
}));

// Global user injection so all forms get user
app.use((req, res, next) => {
    if (req.session && req.session.isLoggedIn) {
        res.locals.user = {
            username: req.session.username,
            isLoggedIn: true
        };
    } else {
        res.locals.user = null;
    }
    next();
});

accounts = [
    {
        username: "admin",
        password: "password"
    }
]; // In-memory user accounts
comments = [
    { 
        author: "SampleUsr",
        text: "This is a sample comment.",
        createdAt: new Date()
    }
]; // In-memory comments/posts

// ---- Routes ----
// Home
app.get('/', (req, res) => {
        res.render('home', {
            title: "Welcome to the Community Forum",
            message: "This is the home page rendered with Handlebars.",
            year: new Date().getFullYear()
        });
});

// Existing Comments
app.get('/comments', (req, res) => {
    res.render('comments', { title: "Forum Posts", comments: comments });
});

// New Comment
app.get('/comment/new', (req, res) => {
    res.render('new-comment', { title: "Create New Post" })
});
app.post('/comment', (req, res) => {
    if (!req.session || !req.session.isLoggedIn) {
        return res.status(401).send('You must be logged in to post a comment.');
    }
    const author = req.session.username;
    const text = req.body.text;
    const createdAt = new Date();
    comments.push({ author, text, createdAt });
    res.redirect('/comments');
});

// Login
app.get('/login', (req, res) => {
    res.render('login', { title: "Login" })
});
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Find user account with matching username and password
    const user = accounts.find(acc => acc.username === username && acc.password === password);

    if (user) {
        req.session.isLoggedIn = true;
        req.session.username = username;
        console.log('Successful login for user: ' + username);
        res.redirect('/');
    } else {
        res.render('login', { error: 'Invalid username or password' });
        console.log('Failed login attempt for user: ' + username);
    }
});
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session:', err);
        }
        res.redirect('/');
    });
});

// Register
app.get('/register', (req, res) => {
    res.render('register', { title: "Register" });
});
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    accounts.push({ username: username, password: password });
    res.redirect('/login');
});

app.get('/testing', (req, res) => {
    res.send('List of accounts: ' + JSON.stringify(accounts));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
