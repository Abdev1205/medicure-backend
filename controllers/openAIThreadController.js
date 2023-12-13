import OpenAI from "openai";
import { config } from "dotenv";
config({
    path: ".env"
});

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY
});

const assistantID = process.env.OPEN_AI_ASSISTANT_ID;

const checkStatus = async (threadID, runID) => {
    const runs = await openai.beta.threads.runs.retrieve(
        threadID,
        runID,
    );
    return runs.status;
};

const waitForCompletion = async (runStatus, runID, threadID) => {
    let measure = 0;
    while (runStatus !== "completed") {
      await sleep(1000);
      console.log(measure);
      measure++;
      runStatus = await checkStatus(threadID, runID);
    }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const callAssistant = async (levelDesc, ArenaDesc, currentLevel) => {
    // create thread
    const thread = await openai.beta.threads.create();
    // message thread
    const message = await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: "Give Level 1 quiz in format that is provided. No additional text is necessary. Minimum size = 10 and change the questions, ans and text accordingly. You dont need to do anything extra or anything else."
    })
    // run thread
    const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistantID,
        instructions: "You are general student assessment quiz generator which can generate different levels of expertise catered towards different types of users and students. Levels Involves basic mcq questions, fill in the blanks etc. There are 4 levels each increasing in complexity and hardness of the subject or Arena :" + `${ArenaDesc}`+ "and the level description is:" + `${levelDesc}` + "You take a round for 5 questions. There are 4 levels Level 1, Level 2, Level 3, Leve 4 according to increasing difficulty and analysis. Current level of quiz you should generate is:" + `${currentLevel}` + "always return in this format. You should ignore the french questions and fill the ans and text accordingly and no additional text to be followed or preceded before this. {\"Lvl\":\"  " + `${currentLevel}`  + " \",\"size\":10,\"questions\":[{\"format\":\"mcq\",\"text\":\"What is the word for 'they' in French?\",\"options\":[\"Elles\",\"Vont\",\"Elles Vont\",\"Nous\"],\"ans\":\"Elles\"},{\"format\":\"mcq\",\"text\":\"Girl\",\"options\":[\"Fille\"]},{\"format\":\"mcq\",\"text\":\"Which of the following means 'good morning' in French?\",\"options\":[\"Bonsoir\",\"Bonjour\",\"Bonne nuit\",\"Salut\"],\"ans\":\"Bonjour\"},{\"format\":\"mcq\",\"text\":\"Book\",\"options\":[\"Livre\"]},{\"format\":\"mcq\",\"text\":\"What is the French word for 'yes'?\",\"options\":[\"Non\",\"Oui\",\"Peut-être\",\"Merci\"],\"ans\":\"Oui\"},{\"format\":\"mcq\",\"text\":\"My name is ${}.\",\"options\":[\"Je m'appelle\"]},{\"format\":\"mcq\",\"text\":\"Car\",\"options\":[\"Voiture\"]},{\"format\":\"mcq\",\"text\":\"What is the word for 'they' in French?\",\"options\":[\"Elles\",\"Vont\",\"Elles Vont\",\"Nous\"],\"ans\":\"Elles\"},{\"format\":\"mcq\",\"text\":\"What is the capital of France?\",\"options\":[\"Berlin\",\"Madrid\",\"Paris\",\"Rome\"],\"ans\":\"Paris\"},{\"format\":\"mcq\",\"text\":\"How do you say 'thank you' in French?\",\"options\":[\"Merci\",\"Bonjour\",\"Excusez-moi\",\"Oui\"],\"ans\":\"Merci\"}]"
        ,
    })
    // get thread op
    await waitForCompletion(run.status, run.id, thread.id);

    const messages = await openai.beta.threads.messages.list(
        thread.id
    )

    // send op in json
    return  JSON.parse(messages.body.data[0].content[0].text.value);
}

export const generateQuiz = async (req, res) => {
    const {levelDesc, ArenaDesc, currentLevel} = req.body;
    console.log(levelDesc, ArenaDesc, currentLevel);
    try {
        const data = await callAssistant(levelDesc, ArenaDesc, currentLevel);
        if(data)
            res.status(200).send({
                success: true,
                data
            })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Error fetching subjects from DB"
        });
    }
};