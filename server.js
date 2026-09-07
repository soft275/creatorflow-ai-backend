require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 10000;

if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is missing!");
} else {
    console.log("✅ Gemini API key detected.");
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(cors());
app.use(express.json({ limit: "2mb" }));

// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CreatorFlow AI Backend is running 🚀"
    });
});

// ===============================
// GENERATE SCRIPT
// ===============================

app.post("/api/generate-script", async (req, res) => {
console.log("🔥 GENERATE SCRIPT REQUEST RECEIVED");
    try {

        const {
            topic,
            type,
            tone,
            language
        } = req.body;

        if (!topic || topic.trim() === "") {
            return res.status(400).json({
                success: false,
                error: "Please provide a story topic."
            });
        }

        const prompt = `
You are CreatorFlow AI, a professional YouTube script writer.

Create a complete and engaging YouTube story.

TOPIC:
${topic}

CONTENT TYPE:
${type || "Story"}

TONE:
${tone || "Engaging"}

LANGUAGE:
${language || "English"}

RULES:

- Write a COMPLETE story, not a short hint.
- Start with a strong hook.
- Create detailed scenes.
- Include narration and dialogue when appropriate.
- Keep characters consistent.
- Make the story entertaining.
- Build suspense, emotion, humor, or curiosity where appropriate.
- Give the story a proper ending.
- Use simple language.
- Return only the finished script.

Create enough scenes to properly tell the entire story.

Format:

TITLE

HOOK

SCENE 1

SCENE 2

SCENE 3

SCENE 4

SCENE 5

Continue with additional scenes when necessary.

ENDING

CALL TO ACTION
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        res.json({
            success: true,
            script: response.text
        });

    } catch (error) {

        console.error("Gemini Script Error:", error);

        res.status(500).json({
            success: false,
            error: "Gemini could not generate the script."
        });
    }
});

// ===============================
// GENERATE IMAGE PROMPTS
// ===============================

app.post("/api/generate-prompts", async (req, res) => {

    try {

        const {
            script,
            style
        } = req.body;

        if (!script || script.trim() === "") {
            return res.status(400).json({
                success: false,
                error: "Please provide a script."
            });
        }

        const prompt = `
You are CreatorFlow AI, a professional cinematic image-prompt generator.

Turn this YouTube script into detailed AI image prompts.

SCRIPT:

${script}

IMAGE STYLE:

${style || "Cinematic"}

RULES:

- Break the story into important scenes.
- Create one detailed image prompt for each scene.
- Keep characters consistent.
- Describe appearance and clothing.
- Describe the environment.
- Include lighting.
- Include camera angle.
- Include camera shot.
- Include emotions.
- Include cinematic composition.
- Make every prompt detailed and usable by an image generator.
- Do not give short hints.

Format:

SCENE 1

PROMPT:
[Detailed prompt]

SCENE 2

PROMPT:
[Detailed prompt]

SCENE 3

PROMPT:
[Detailed prompt]

Continue until all important scenes are covered.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        res.json({
            success: true,
            prompts: response.text
        });

    } catch (error) {

        console.error("Gemini Prompt Error:", error);

        res.status(500).json({
            success: false,
            error: "Gemini could not generate the image prompts."
        });
    }
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `CreatorFlow AI backend running on port ${PORT}`
    );

});
