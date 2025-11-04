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
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// In-memory data
const accounts = [ { username: 'admin', password: 'password' } ];
const comments = [ { author: 'SampleUser', text: 'This is a sample comment.', createdAt: new Date() } ];
const sessions = [];

// Make user available to all templates
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

// Home route
app.get('/', (req, res) => {
    res.render('home', {
        title: 'Welcome to the Community Forum',
        message: 'This is the home page rendered with Handlebars.',
        year: new Date().getFullYear(),
        recentComments: comments.slice(-3).reverse()
    });
});

// Existing Comments
app.get('/comments', (req, res) => {
    res.render('comments', { title: "Forum Posts", comments: comments });
});

// New Comment
app.get('/comment/new', (req, res) => {
    res.render('new-comment', { title: 'Create New Post' });
});
app.post('/comment', (req, res) => {
    if (!req.session || !req.session.isLoggedIn) {
        return res.status(401).render('login', {
            title: 'Login',
            error: 'You must be logged in to post a comment.'
        });
    }
    const author = req.session.username;
    const text = req.body.text;
    const createdAt = new Date();
    comments.push({ author, text, createdAt });
    res.redirect('/comments');
});

// Login
app.get('/login', (req, res) => {
    if (req.session.isLoggedIn) return res.redirect('/');
    res.render('login', { title: 'Login' });
});
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Find user account with matching username and password
    const user = accounts.find(acc => acc.username === username && acc.password === password);

    if (user) {
        req.session.isLoggedIn = true;
        req.session.username = username;
        const sessionId = Math.random().toString(36).slice(2);
        res.cookie('sessionCookie', JSON.stringify({
            username: username,
            sessionId: sessionId
        }));
        sessions.push({ username, sessionId, created: Date.now() });
        req.session.sessionId = sessionId;
        return res.redirect('/');
    }
    return res.status(401).render('login', {
        title: 'Login',
        error: 'Invalid username or password',
        username
    });
});

// Logout (POST for CSRF-protection patterns)
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session:', err);
        }
        res.clearCookie('sessionCookie');
        res.redirect('/');
    });
});

// Register
app.get('/register', (req, res) => {
    res.render('register', { title: "Register" });
});
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).render('register', { title: 'Register', error: 'Username and password required' });
    }
    if (accounts.find(u => u.username === username)) {
        return res.status(400).render('register', { title: 'Register', error: 'Username already exists' });
    }
    accounts.push({ username, password });
    res.redirect('/login');
});

app.get('/testing', (req, res) => {
    res.send('List of accounts: ' + JSON.stringify(accounts));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
