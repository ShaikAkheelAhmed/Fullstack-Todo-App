const usersModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const emailExist = (err) => err.message.indexOf('duplicate key error') > -1;
const isValidationError = (err) => err.name === 'ValidationError';

const signUp = async (req, res) => {
    try {
        const body = req.body;

        if (!body.name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        if (!body.email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        if (!body.password) {
            return res.status(400).json({ message: 'Password is required' });
        }

     
        body.password = await bcrypt.hash(body.password, 10);

        const create = new usersModel(body);
        await create.save();

       
        const token = jwt.sign(
            { id: create._id, email: create.email },
            "secretkey", 
            { expiresIn: "1h" }
        );

       
        res.status(201).json({
            message: "Sign up Success",
            token,        
            user: create  
        });
    } catch (err) {
        if (emailExist(err)) {
            res.status(400).json({ message: 'Email already exists' });
        } else if (isValidationError(err)) {
            const messages = Object.values(err.errors).map(e => e.message);
            res.status(400).json({
                message: 'Validation failed',
                errors: messages
            });
        } else {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        const user = await usersModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign(
                { 
                   id: user._id, email: user.email, 
                  
                },
                'secretkey',
                { expiresIn: '1h' }
            );
            res.status(200).json({ token });
        }
        else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    }
    catch (err) {
        console.error(err); 
        res.status(500).send('Internal server error');
    }
};

const userCtrl = {
    signUp,
    signIn
};

module.exports = userCtrl;