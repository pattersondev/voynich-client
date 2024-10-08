"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Key, Copy, CheckCircle, Shield, Github } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createChat } from "@/services/api";

export default function Landing() {
  const [chatLink, setChatLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [chatLength, setChatLength] = useState("24h");
  const router = useRouter();

  const generateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createChat(chatLength);
      const { id, token } = response;
      localStorage.setItem("chatToken", token);
      const generatedLink = `${window.location.origin}/chat/${id}`;
      setChatLink(generatedLink);
    } catch (error) {
      console.error("Error generating chat link:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(chatLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const joinChat = () => {
    if (chatLink) {
      router.push(chatLink);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden relative px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-6 sm:p-8 space-y-8 bg-gray-800 rounded-xl shadow-2xl transform transition-all hover:scale-105 relative z-10">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-indigo-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">Voynich</h2>
          <p className="mt-2 text-sm text-gray-400">
            Generate a secure, encrypted chat link
          </p>
        </div>
        <form onSubmit={generateLink} className="mt-8 space-y-6">
          <div className="mt-4">
            <label
              htmlFor="chat-length"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Chat Length
            </label>
            <Select onValueChange={setChatLength} defaultValue={chatLength}>
              <SelectTrigger className="w-full bg-gray-700 text-gray-300 border-gray-600">
                <SelectValue placeholder="Select chat length" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-gray-300 border-gray-600">
                <SelectItem value="1h">1 hour</SelectItem>
                <SelectItem value="24h">24 hours</SelectItem>
                <SelectItem value="1w">1 week</SelectItem>
                <SelectItem value="1m">1 month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Key
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 animate-key"
                  aria-hidden="true"
                />
              </span>
              Generate Encrypted Link
            </Button>
          </div>
        </form>
        {chatLink && (
          <div className="mt-8 space-y-4">
            <label
              htmlFor="chat-link"
              className="block text-sm font-medium text-gray-400"
            >
              Your Encrypted Chat Link
            </label>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  name="chat-link"
                  id="chat-link"
                  value={chatLink}
                  readOnly
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md text-gray-300 bg-gray-700 border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                aria-label={copied ? "Copied" : "Copy to clipboard"}
                className="bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:text-gray-200"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              onClick={joinChat}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Join Chat
            </Button>
          </div>
        )}
      </div>

      <footer className="mt-8 text-center text-gray-400">
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Link
            href="/privacy"
            className="flex items-center hover:text-white transition-colors"
          >
            <Shield className="h-4 w-4 mr-1" />
            Privacy Policy
          </Link>
          <a
            href="https://github.com/pattersondev/voynich-client"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-white transition-colors"
          >
            <Github className="h-4 w-4 mr-1" />
            Frontend Source
          </a>
          <a
            href="https://github.com/pattersondev/voynich-backend"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-white transition-colors"
          >
            <Github className="h-4 w-4 mr-1" />
            Backend Source
          </a>
        </div>
      </footer>
    </div>
  );
}
