import { CreateWebLLMChat } from "https://unpkg.com/webllm";

let chat = null;

async function loadModel() {
  const output = document.getElementById("output");
  output.textContent = "Loading Noter4 AI model... (first load may take a minute)";

  try {
    chat = await CreateWebLLMChat({
      model: "phi3-mini-4k-instruct-q4f16_1"
    });

    output.textContent = "Model loaded. Noter4 AI is ready.";
  } catch (err) {
    output.textContent = "Failed to load model. Your browser must support WebGPU.";
    console.error(err);
  }
}

async function runNoter4() {
  const prompt = document.getElementById("prompt").value;
  const output = document.getElementById("output");

  if (!chat) {
    output.textContent = "Model not loaded yet.";
    return;
  }

  output.textContent = "";

  try {
    await chat.generate(prompt, {
      stream: (token) => {
        output.textContent += token;
      }
    });
  } catch (err) {
    output.textContent = "Error running Noter4 AI.";
    console.error(err);
  }
}

document.getElementById("run").onclick = runNoter4;

loadModel();
