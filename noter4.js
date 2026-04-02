import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers/dist/transformers.min.js";

let noter4Pipe = null;
let noter4PlusPipe = null;

const PLUS_LIMIT = 5;
const PLUS_WINDOW_MS = 10 * 60 * 1000;
let plusCalls = [];

async function loadModels() {
  const output = document.getElementById("output");
  output.textContent = "Loading Noter4 models...";

  noter4Pipe = await pipeline("text-generation", "Xenova/phi-2");
  noter4PlusPipe = await pipeline("text-generation", "Xenova/llama-3-8b");

  output.textContent = "Models loaded. Noter4 is ready.";
}

function canUseNoter4Plus() {
  const now = Date.now();
  plusCalls = plusCalls.filter(t => now - t < PLUS_WINDOW_MS);
  return plusCalls.length < PLUS_LIMIT;
}

async function runNoter4() {
  const prompt = document.getElementById("prompt").value;
  const modelChoice = document.getElementById("model").value;
  const output = document.getElementById("output");

  if (!noter4Pipe || !noter4PlusPipe) {
    output.textContent = "Models still loading...";
    return;
  }

  output.textContent = "";

  let pipe = noter4Pipe;

  if (modelChoice === "noter4plus") {
    if (!canUseNoter4Plus()) {
      output.textContent = "Noter4+ rate limit reached. Try again later.";
      return;
    }
    plusCalls.push(Date.now());
    pipe = noter4PlusPipe;
  }

  const result = await pipe(prompt, {
    max_new_tokens: 150,
    temperature: 0.7
  });

  output.textContent = result[0].generated_text;
}

document.getElementById("run").onclick = runNoter4;

loadModels();
