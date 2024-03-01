import {authUser} from "./controllers/user.js"
import express from "express";

const router = express.Router();

router.post('/data/user', authUser);

export default router;

