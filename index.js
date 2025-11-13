const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

// Ключ будет храниться в переменной окружения на Render
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend for School Future Comic is running ✅");
});

app.post("/generate-comic", async (req, res) => {
  try {
    const { childName, gender, job } = req.body;

    const name = childName || "Ваш ребёнок";
    const genderWord = gender === "girl" ? "она" : "он";
    const jobName = job || "специалист будущего";

    // 3 сцены для начала — потом можно расширить до 7
    const scenes = [
      {
        title: "Сцена 1/3 — Утро",
        text: `2035 год. ${name} просыпается и собирается на работу. Сегодня ${genderWord} снова работает как ${jobName}.`,
        prompt: `cute colorful comic panel of ${name} as a ${jobName} in the morning, futuristic home, soft light, simple background, no text, kids illustration style`
      },
      {
        title: "Сцена 2/3 — День",
        text: `Днём ${name} решает важные задачи, вспоминая школьные уроки и учебники, по которым учился(ась).`,
        prompt: `comic style illustration of ${name} as a ${jobName} during the day at work, screens, holograms, futuristic office, bright colors, no text, for children`
      },
      {
        title: "Сцена 3/3 — Вечер",
        text: `Вечером ${name} благодарит родителей за поддержку интереса к учёбе и будущей профессии.`,
        prompt: `evening scene, ${name} as a ${jobName} relaxing at home, warm light, cozy futuristic room, comic panel, no text, heartwarming`
      }
    ];

    // Генерируем картинку для каждой сцены
    for (const scene of scenes) {
      const imageResponse = await openai.images.generate({
        model: "gpt-image-1",
        prompt: scene.prompt,
        size: "1024x1024"
      });

      const b64 = imageResponse.data[0].b64_json;
      scene.imageDataUrl = `data:image/png;base64,${b64}`;
    }

    res.json({ scenes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка при генерации комикса" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on port " + port);
});
