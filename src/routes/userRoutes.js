import express from "express";
import User from "../models/User.js";
import { updateUser } from "../controllers/authController.js";

const router = express.Router();

router.get('/delete/:id', async (req, res) => {
    await User.deleteOne({ _id: req.params.id });
    res.redirect('/')
})

router.get('/edit/:id', async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    res.render('pages/edit.ejs', { user });
})

router.post('/edit/submit', updateUser);

export default router;
