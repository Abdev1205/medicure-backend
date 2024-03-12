import OpenAI from "openai";
import { Reports } from "../models/report.js";
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
      "Here are the abbreviations akiec = Actinic keratoses and intraepithelial carcinoma / Bowen's disease, bcc = Basal cell carcinoma, bkl = Benign keratosis-like lesions (solar lentigines / seborrheic keratoses and lichen-planus like keratoses) df = Dermatofibroma, mel = Melanoma, nv = Melanocytic nevi, vasc = Vascular lesions (angiomas, angiokeratomas, pyogenic granulomas and hemorrhage)._inference = The disease that has highest possible chance of happening on the basis of percentages of different diseases. In above format the numbers folowing the labels denote the % likliness of the affected by corresponding disease while the _inference tag denote the disease that has highest possible chance of happening",
  });
  // run thread
  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistantID,
    instructions: `${data} Here are the abbreviations akiec = Actinic keratoses and intraepithelial carcinoma / Bowen's disease, bcc = Basal cell carcinoma, bkl = Benign keratosis-like lesions (solar lentigines / seborrheic keratoses and lichen-planus like keratoses) df = Dermatofibroma, mel = Melanoma, nv = Melanocytic nevi, vasc = Vascular lesions (angiomas, angiokeratomas, pyogenic granulomas and hemorrhage)._inference = The disease that has highest possible chance of happening on the basis of percentages of different diseases. In above format the numbers folowing the labels denote the % likliness of the affected by corresponding disease while the _inference tag denote the disease that has highest possible chance of happening. Describe what is the disease basal cell carcinoma if it's the disease. Don't need to end the ans in open ended manner so no would you like to know more? style of questions. Give your analyisis based on what the patient is suffering from the data is provided to you in the format in this prompt itself at the start of the text.
      {
      akiec: "0.0"
      bcc: "99.97"
      bkl: "0.0"
      df: "0.0"
      mel: "0.0"
      nv: "0.030000001"
      vasc: "0.0"
      _inference: "bcc"
  }`,
  });
  // get thread op
  await waitForCompletion(run.status, run.id, thread.id);

  const messages = await openai.beta.threads.messages.list(thread.id);
  // send op in json
  return messages.body.data[0].content[0].text.value;
};

export const generateQuiz = async (req, res) => {
  const { patientData } = req.body;
  console.log(patientData);
  try {
    const data = await callAssistant(patientData);
    Reports.create({ Parameters: patientData, analysis: data });

    const report = await Reports.findOne({
      Parameters: patientData,
      analysis: data,
    });

    if (data)
      res.status(200).send({
        success: true,
        id: report.id,
        data,
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error fetching report from DB",
    });
  }
};
