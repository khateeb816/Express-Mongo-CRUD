import express from "express";
import UserModel from '../models/User.js'
import { getUser } from "../services/session.js";

const router = express.Router();

router.use((req, res, next) => {
    const allowedRoutes = ['/user/login', '/user/register', '/user/login/submit', '/user/register/submit'];

    if (allowedRoutes.includes(req.path)) {
        return next();
    }

    if (req.cookies.id) {
        return next();
    }

    return res.redirect('/user/login');
});

router.get('/', async (req, res) => {
    let user = await getUser(req.cookies.id);
    let allUsers = await UserModel.find({ _id: { $ne: user.id } });
    res.render('pages/home', { user, allUsers });
});

export default router;
