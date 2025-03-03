import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { getUser, setUser } from '../services/session.js';
import UserModel from '../models/User.js';
import User from '../models/User.js';

export async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
            name,
            email,
            password: hashedPassword,
            isAdmin: false
        });

        res.redirect('/user/login');
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).send("Server Error");
    }
}

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        let user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        //  Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        //  Create session and store user
        let sessionId = uuidv4();
        setUser(sessionId, user);

        //  Set secure cookie
        res.cookie('id', sessionId, {
            httpOnly: true, // Prevents JavaScript access (More Secure)
            secure: true, // Send only over HTTPS
            maxAge: 24 * 60 * 60 * 1000 // Expires in 1 day
        });

        res.redirect('/');
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).send("Server Error");
    }
}

export async function logoutUser(req, res) {
    res.clearCookie("id").redirect('/user/login');
}

export async function updateUser(req, res) {
    try {
        const { _id, name, email } = req.body;

        if (!_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            _id, // Find user by ID
            { name, email }, // Fields to update
            { new: true, runValidators: true } // Return updated document & validate
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.redirect('/');
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Server Error" });
    }
}
