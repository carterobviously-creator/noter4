import * as webllm from "https://unpkg.com/webllm/dist/webllm.min.js";

let engine = null;

async function loadModel() {
  const output = document.getElementById("output");
  output.textContent = "Loading Noter4 AI model...";

  try {
    engine = await webllm.CreateMLCEngine(
      "phi3-mini-4k-instruct-q4f16_1",
      {
        initProgressCallback: (progress) => {
          output.textContent = `Loading: ${Math.floor(progress.progress * 100)}%`;
        }
      }
    );

    output.textContent = "Model loaded. Noter4 AI is ready.";
  } catch (err) {
    output.textContent = "Failed to load model. Your browser must support WebGPU.";
    console.error(err);
  }
}

async function runNoter4() {
  const prompt = document.getElementById("prompt").value;
  const output = document.getElementById("output");

  if (!engine) {
    output.textContent = "Model not loaded yet.";
    return;
  }

  output.textContent = "";

  try {
    const reply = await engine.chat.completions.create({
      messages: [
        { role: "user", content: prompt }
      ],
      stream: true
    });

    for await (const chunk of reply) {
      const token = chunk.choices[0]?.delta?.content || "";
      output.textContent += token;
    }
  } catch (err) {
    output.textContent = "Error running Noter4 AI.";
    console.error(err);
  }
}

document.getElementById("run").onclick = runNoter4;

loadModel();
