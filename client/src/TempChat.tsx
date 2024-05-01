import { useEffect, useRef, useState } from "react";

import dummyData from "./dummyData";

import "./App.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

//components

function TempChat({ deviceName }) {
  return (
    <div className="App">
      <section>
        <ChatRoom deviceName={deviceName} />
      </section>
    </div>
  );
}

function ChatRoom({ deviceName }) {
  const dummy = useRef();
  useEffect(() => {
    const dN = deviceName
      .split("-")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
      .replace(/5g/g, "5G")
      .replace(/Gb/g, "GB");
    const initMsg = {
      content: `Hi There! Welcome to Flipkart Smart-Assist! How can I assist you with ${dN}?`,
      name: "Assistant",
      timestamp: new Date(),
    };
    setMessages([...messages, initMsg]);
  }, []);

  const [messages, setMessages] = useState(dummyData);
  // const [recMsgs, setRecMsgs] = useState([]);
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    const genAI = new GoogleGenerativeAI(
      "AIzaSyArppRMJTf5_pXxPofxB9hjqpQjbvVTqgk",
    );
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const newMsg = {
      content: `${formValue}`.toString(),
      name: "User",
      timestamp: new Date(),
    };

    /*PLEASE DON'T CHANGE THE BELOW LINE, IT SOMEHOW WORKS, I HAVE NO CLUE HOW*/
    messages.push(newMsg);

    dummy.current.scrollIntoView({ behavior: "smooth" });
    window.scrollTo(0, document.body.scrollHeight);
    setFormValue("");

    console.log("Now triggering API", messages);
    const prompt = `Previous Chats-${JSON.stringify(
      messages,
    )}, Here is the list of all previous interactions between you and user. Here is the user's latest response-${formValue} Now provide further assistance as store assistant. Try to limit response to 30 words(use more if deemed necessary) and pretend as if you are interacting with the user in a chatbot. If required use indian currency. Use GSMarena as a source first for electronics. Mention prices only if explicitly asked by the user.`;

    const result = await model.generateContent(prompt);
    const response = result.response;

    const newResp = {
      content: response.text(),
      name: "Assistant",
      timestamp: new Date(),
    };
    setMessages([...messages, newResp]);

    dummy.current.scrollIntoView({ behavior: "smooth" });
    window.scrollTo(0, document.body.scrollHeight);
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      </main>

      <form onSubmit={sendMessage} id="userQ">
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Ask me anything"
        />

        <button className="btn" type="submit" disabled={!formValue}>
          🕊️
        </button>
      </form>
      <span ref={dummy}></span>
    </>
  );
}

function ChatMessage(props) {
  const { content, name } = props.message;

  // const messageClass = "sent";
  const messageClass = name == "Assistant" ? "received" : "sent";
  return (
    <>
      <div className={`message ${messageClass}`}>
        {messageClass == "received" && <img src="/icon32.png" />}
        <p>{content}</p>
      </div>
    </>
  );
}

export default TempChat;
