import { CreateWebLLMChat } from "https://unpkg.com/webllm";

let chat = null;

async function loadModel() {
  const output = document.getElementById("output");
  output.textContent = "Loading Noter4 AI model... (first time may take a minute)";

  chat = await CreateWebLLMChat({
    model: "phi-3-mini",
    model_url: "./models/phi-3-mini-q4f16.bin"
  });

  output.textContent = "Model loaded. Noter4 AI is ready.";
}

async function runNoter4() {
  const prompt = document.getElementById("prompt").value;
  const output = document.getElementById("output");

  if (!chat) {
    output.textContent = "Model not loaded yet.";
    return;
  }

  output.textContent = "";

  const reply = await chat.generate(prompt, {
    stream: (token) => {
      output.textContent += token;
    }
  });
}

document.getElementById("run").onclick = runNoter4;

loadModel();
