const worker = new Worker("webllm.worker.js"); // CLASSIC WORKER

const output = document.getElementById("output");

worker.onmessage = (event) => {
  const { type, data } = event.data;

  if (type === "progress") {
    output.textContent = `Loading: ${Math.floor(data * 100)}%`;
  }

  if (type === "ready") {
    output.textContent = "Model loaded. Noter4 AI is ready.";
  }

  if (type === "token") {
    output.textContent += data;
  }
};

document.getElementById("run").onclick = () => {
  const prompt = document.getElementById("prompt").value;
  output.textContent = "";
  worker.postMessage({ type: "prompt", data: prompt });
};
