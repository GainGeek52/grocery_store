const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.showSignup = (req, res) => {
    res.render('auth/signup');
};

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('auth/signup', { 
                error: 'Email already registered'
            });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = new User({ 
            name, 
            email, 
            password: hash,
            isAdmin: false // Ensure new signups are not admin
        });
        await user.save();

        // Start a fresh session
        req.session.regenerate((err) => {
            if (err) {
                console.error('Session regenerate error:', err);
                return res.redirect('/auth/login');
            }
            
            req.session.user = { 
                id: user._id, 
                name: user.name,
                isAdmin: false
            };
            res.redirect('/');
        });
    } catch (err) {
        console.error(err);
        res.render('auth/signup', { 
            error: 'Error creating account'
        });
    }
};

exports.showLogin = (req, res) => {
    // If already logged in, redirect appropriately
    if (req.session.user) {
        return res.redirect(req.session.user.isAdmin ? '/admin/dashboard' : '/');
    }
    res.render('auth/login', { error: null });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('auth/login', { 
                error: 'Invalid email or password'
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.render('auth/login', { 
                error: 'Invalid email or password'
            });
        }

        // Regenerate session to prevent session fixation
        req.session.regenerate((err) => {
            if (err) {
                console.error('Session regenerate error:', err);
                return res.render('auth/login', { 
                    error: 'Login error, please try again'
                });
            }

            req.session.user = { 
                id: user._id,
                name: user.name,
                isAdmin: user.isAdmin
            };

            // Admin vs regular user redirect
            if (req.originalUrl.startsWith('/admin')) {
                if (user.isAdmin) {
                    res.redirect('/admin/dashboard');
                } else {
                    res.render('auth/login', { 
                        error: 'Admin access required'
                    });
                }
            } else {
                res.redirect('/');
            }
        });
    } catch (err) {
        console.error(err);
        res.render('auth/login', { 
            error: 'Login error, please try again'
        });
    }
};

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !user.isAdmin) {
            return res.render('admin/login', { 
                error: 'Invalid admin credentials'
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.render('admin/login', { 
                error: 'Invalid admin credentials'
            });
        }

        // Regenerate session for admin login
        req.session.regenerate((err) => {
            if (err) {
                console.error('Session regenerate error:', err);
                return res.render('admin/login', { 
                    error: 'Login error, please try again'
                });
            }

            req.session.user = { 
                id: user._id,
                name: user.name,
                isAdmin: true
            };
            res.redirect('/admin/dashboard');
        });
    } catch (err) {
        console.error(err);
        res.render('admin/login', { 
            error: 'Login error, please try again'
        });
    }
};

exports.logout = (req, res) => {
    // Properly destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
        }
        // Clear the cookie
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};

exports.showAdminLogin = (req, res) => {
    if (req.session.user?.isAdmin) {
        return res.redirect('/admin/dashboard');
    }
    res.render('admin/login', { error: null });
};
