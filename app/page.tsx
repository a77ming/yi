"use client";
import React, { useState } from 'react';

const ChatPage = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/yi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({
          model: 'yi-large',
          messages: [...messages, userMessage],
          temperature: 0.3
        })
      });

      const data = await response.json();
      const assistantMessage = data.choices && data.choices.length > 0
        ? data.choices[0].message.content
        : "Sorry, I couldn't understand your request.";

      setMessages([...messages, userMessage, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([...messages, userMessage, { role: 'assistant', content: 'An error occurred. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="chat-box">
        <h1 className="title">鸣酱 AI对话模型</h1>
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
          {loading && <div className="message assistant">正在生成回复...</div>}
        </div>
        <div className="input-box">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input"
            placeholder="请输入内容..."
          />
          <button onClick={sendMessage} className="send-button">发送</button>
        </div>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100vw; /* 确保宽度覆盖整个视口 */
          font-family: 'Helvetica Neue', sans-serif;
        }
        .chat-box {
          width: 90%;
          max-width: 600px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          height: 80vh;
          overflow: hidden;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #00796b;
          margin-bottom: 15px;
        }
        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
          display: flex;
          flex-direction: column;
        }
        .message {
          padding: 12px;
          border-radius: 15px;
          margin: 4px 0;
          max-width: 75%;
          word-wrap: break-word;
          position: relative;
          clear: both;
        }
        .message.user {
          background-color: #b3e5fc;
          align-self: flex-end;
          text-align: right;
        }
        .message.assistant {
          background-color: #e0e0e0;
          align-self: flex-start;
          text-align: left;
        }
        .input-box {
          display: flex;
          align-items: center;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
        .input {
          flex: 1;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 10px;
          margin-right: 10px;
          outline: none;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        .send-button {
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          background-color: #00796b;
          color: #ffffff;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s ease;
        }
        .send-button:hover {
          background-color: #004d40;
        }
      `}</style>
      
      {/* 添加全局样式来重置默认的 margin 和 padding，并设置背景 */}
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
        }
        body {
          background: linear-gradient(to right, #e0f7fa, #80deea);
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
