import mongoose from "mongoose";

const schema = new mongoose.Schema({
    subjectName: {
        type: String,
        required: true
    },
    arenas:[
        {
            arenaName: {
                type: String,
                required : true
            },
            arenaDesc : {
                type : String,
            },
            levels : [
                {
                    levelDesc : {
                        type : String
                    }
                }
            ]
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

export const Subjects = mongoose.model("Subjects", schema);