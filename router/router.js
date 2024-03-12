import express from "express";
import  {testApi} from  "../controllers/testingControllers.js"
import {addSubject, fetchSubjects} from "../controllers/subjectController.js"
import {isAuthenticated} from "../middlewares/isAuthenticated.js"
import { getMyProfile, login, logout, register } from "../controllers/userController.js"
import { generateQuiz} from "../controllers/openAIThreadController.js"
import { sendReport } from "../controllers/getReport.js";
const router = express.Router();

router.get('/testing', testApi);

// subjects
router.post('/addSubjects', addSubject);
router.get('/fetchSubjects', fetchSubjects);

// Report IGNORE QUIZ
router.post('/generate', generateQuiz);
router.post("/reports", sendReport);

// user
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isAuthenticated, getMyProfile);

export default router;