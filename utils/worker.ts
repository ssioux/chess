// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

onmessage = (e) => {

    console.log("in worker", e);
    postMessage("Hi from worker");
  };