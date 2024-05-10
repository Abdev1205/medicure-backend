import express from "express";
import { testApi } from "../controllers/testingControllers.js"
import { isAuthenticated } from "../middlewares/isAuthenticated.js"
import { register } from "../controllers/AuthController/register.js"
import { login } from "../controllers/AuthController/login.js"
import { logout } from "../controllers/AuthController/logout.js"
import { generateQuiz } from "../controllers/openAIThreadController.js"
import { sendReport } from "../controllers/getReport.js";
const router = express.Router();

router.get('/testing', testApi);

// Report for disease
router.post('/generate', generateQuiz);
router.get("/reports", sendReport);

// user
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

export default router;