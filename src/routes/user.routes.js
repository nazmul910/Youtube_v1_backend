import {Router} from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();


  router.post("/register",registerUser)
  router.get("/register",registerUser)

export default router;