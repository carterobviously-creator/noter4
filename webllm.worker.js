importScripts("https://unpkg.com/webllm/dist/webllm.min.js");

let engine = null;

async function loadModel() {
  engine = await webllm.CreateMLCEngine(
    "phi3-mini-4k-instruct-q4f16_1",
    {
      initProgressCallback: (p) => {
        postMessage({ type: "progress", data: p.progress });
      }
    }
  );

  postMessage({ type: "ready" });
}

loadModel();

onmessage = async (event) => {
  const { type, data } = event.data;

  if (type === "prompt") {
    const reply = await engine.chat.completions.create({
      messages: [{ role: "user", content: data }],
      stream: true
    });

    for await (const chunk of reply) {
      const token = chunk.choices[0]?.delta?.content || "";
      postMessage({ type: "token", data: token });
    }
  }
};
