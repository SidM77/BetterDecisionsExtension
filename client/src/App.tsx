import { SetStateAction, useEffect, useState } from "react";
import "./App.css";
import "./TempChat.js";
import TempChat from "./TempChat.js";

function App() {
  const [count, setCount] = useState(0);
  const [deviceName, setDeviceName] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  async function sayHello() {
    let [tab] = await chrome.tabs.query({ active: true });
    await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => {
        console.log("Entered GenAI section");
        let url = new URL(window.location.href);
        let parts = url.pathname.split("/");
        let productDash = parts[1];
        setDeviceName(productDash);
        // document.body.style.backgroundColor = "red";
      },
    });
  }

  useEffect(() => {
    console.log("USEFFECT");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        let url = new URL(tabs[0].url);
        let parts = url.pathname.split("/");
        let productDash = parts[1];
        setDeviceName(productDash);
        setUrl(tabs[0].url);
      }
    });
  }, []);

  return (
    <>
      {deviceName && <TempChat deviceName={deviceName} />}
      {/*<div>*/}
    </>
  );
}

export default App;
