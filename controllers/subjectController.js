import { Subjects } from "../models/subjects.js";

export const addSubject = async(req, res) => {
    try {
        const {subjectName, arenas} = req.body;
        
        await Subjects.create({
            subjectName,
            arenas
        })

    }catch (e) {
        console.log(e);
    }
    res.status(201).json({
        success : true,
        message : "Added Subject to DB"
    })
}

export const fetchSubjects = async(req, res) => {
    try {
        const subjects = await Subjects.find();

        res.status(200).send({
            success : true,
            subjects
        })
    }catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Error fetching subjects from DB"
        });
    }
}

export const Add = async (req, res) => {
    
}