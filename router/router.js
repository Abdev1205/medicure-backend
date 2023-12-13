import express from "express";
import  {testApi} from  "../controllers/testingControllers.js"
import  {generateQuiz}  from "../controllers/openAIThreadController.js"
import {addSubject, fetchSubjects} from "../controllers/subjectController.js"
import {isAuthenticated} from "../middlewares/isAuthenticated.js"
import { getMyProfile, login, logout, register } from "../controllers/userController.js";

const router = express.Router();

router.get('/testing', testApi);

// subjects
router.post('/addSubjects', addSubject);
router.get('/fetchSubjects', fetchSubjects);

// Quiz
router.post('/generate', generateQuiz);

// user
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isAuthenticated, getMyProfile);

export default router;