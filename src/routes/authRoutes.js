import express from "express"
import { loginUser, logoutUser, registerUser } from '../controllers/authController.js'

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('auth/register')
})

router.post('/register/submit', registerUser)

router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.post('/login/submit', loginUser);


router.get('/logout', logoutUser);
export default router