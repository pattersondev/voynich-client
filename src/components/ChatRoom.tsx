"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Send, Paperclip, Download } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: string;
  attachment?: {
    url: string;
    name: string;
  };
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "" && !attachment) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "You", // In a real app, this would be a generated anonymous ID
      attachment: attachment
        ? { url: URL.createObjectURL(attachment), name: attachment.name }
        : undefined,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage("");
    setAttachment(null);
  };

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files[0]);
      setAttachment(e.target.files[0]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="bg-gray-800 p-4 flex items-center justify-center shadow-md h-16">
        <div className="flex items-center">
          <Lock className="h-6 w-6 text-indigo-400 mr-2" />
          <h1 className="text-xl font-bold">Voynich</h1>
        </div>
      </header>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "You" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-lg ${
                message.sender === "You"
                  ? "bg-indigo-600 rounded-br-none"
                  : "bg-gray-700 rounded-bl-none"
              }`}
            >
              <p className="text-sm font-semibold mb-1">{message.sender}</p>
              <p className="break-words">{message.text}</p>
              {message.attachment && (
                <div className="mt-2">
                  <p className="text-sm text-gray-300 mb-1">
                    Attachment: {message.attachment.name}
                  </p>
                  <div className="flex items-center space-x-2">
                    <img
                      src={message.attachment.url}
                      alt="Attachment"
                      className="max-w-full h-auto rounded"
                    />
                    <a
                      href={message.attachment.url}
                      download={message.attachment.name}
                      className="bg-gray-600 hover:bg-gray-500 rounded-full p-2"
                    >
                      <Download className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4 bg-gray-800">
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <Input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 rounded-full px-4 py-2"
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-700 hover:bg-gray-600 rounded-full p-2"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 rounded-full p-2"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          {attachment && (
            <div className="text-sm text-gray-300">
              Attachment: {attachment.name}
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAttachment}
          className="hidden"
        />
      </form>
    </div>
  );
}
