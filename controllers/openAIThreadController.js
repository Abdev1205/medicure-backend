import OpenAI from "openai";
import { config } from "dotenv";
config({
  path: ".env",
});

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

const assistantID = process.env.OPEN_AI_ASSISTANT_ID;

const checkStatus = async (threadID, runID) => {
  const runs = await openai.beta.threads.runs.retrieve(threadID, runID);
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const callAssistant = async (data) => {
  // create thread
  const thread = await openai.beta.threads.create();
  // message thread
  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content:
      "Here are the patient's symptoms. You are supposed to tell me what they are suffering from or could be suffering from in a short para.",
  });
  // run thread 
  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistantID,
    instructions:
      "You are a medical patient status analyzer and you analyze the condition of patient and what he may be suffering on based on the symptoms given to you and return an output to the doctor of what you think the patient is going through" +
      `${data}`,
  });
  // get thread op
  await waitForCompletion(run.status, run.id, thread.id);

  const messages = await openai.beta.threads.messages.list(thread.id);
  // send op in json
  return messages.body.data[0].content[0].text.value;
};

export const generateQuiz = async (req, res) => {
  const { patientData } = req.body;
  try {
    const data = await callAssistant(patientData);
    if (data)
      res.status(200).send({
        success: true,
        data,
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error fetching subjects from DB",
    });
  }
};
