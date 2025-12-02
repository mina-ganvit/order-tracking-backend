import { Router } from "express";
import { login, register } from "../controller/user.controller";
import { authorization } from "../middleware/authentication";
const router = Router();

router.post("/login", login);
router.post("/", register);
export default router;
