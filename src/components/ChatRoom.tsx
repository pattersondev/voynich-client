"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Lock,
  Send,
  Paperclip,
  Download,
  X,
  Users,
  FileIcon,
} from "lucide-react";
import { getChat } from "@/services/api";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import {
  format,
  formatDistanceToNowStrict,
  differenceInSeconds,
} from "date-fns";
import { SOCKET_URL } from "@/services/api";
import { v4 as uuidv4 } from "uuid";

interface Attachment {
  name: string;
  type: string;
  data: string;
}

interface Message {
  id: string;
  content: string;
  sender: string;
  created_at: string;
  isCurrentUser: boolean;
  attachment?: Attachment;
}

interface ChatRoomProps {
  id: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function ChatRoom({ id }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [socket, setSocket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chatExpired, setChatExpired] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [onlineUsers, setOnlineUsers] = useState<number>(1);

  const formatTimeLeft = (expiresAt: Date) => {
    const secondsLeft = differenceInSeconds(expiresAt, new Date());
    if (secondsLeft <= 0) return "Expired";

    const days = Math.floor(secondsLeft / 86400);
    const hours = Math.floor((secondsLeft % 86400) / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

    return parts.join(" ");
  };

  useEffect(() => {
    // Generate or retrieve a persistent user ID for this specific chat
    const storedUserIds = JSON.parse(
      localStorage.getItem("chatUserIds") || "{}"
    );
    let chatUserId = storedUserIds[id];
    if (!chatUserId) {
      chatUserId = uuidv4().substring(0, 8); // Generate a short UUID
      storedUserIds[id] = chatUserId;
      localStorage.setItem("chatUserIds", JSON.stringify(storedUserIds));
    }
    setUserId(chatUserId);

    console.log("Attempting to connect to socket");
    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      path: "/socket.io",
    });

    newSocket.on("connect", () => {
      console.log("Socket connected successfully");
      newSocket.emit("join", { chatId: id, userId: chatUserId });
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    newSocket.on("message", (newMessage: Message) => {
      console.log("Received new message:", newMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...newMessage,
          isCurrentUser: newMessage.sender === chatUserId,
        },
      ]);
    });

    newSocket.on("chatExpired", () => {
      console.log("Chat has expired");
      setChatExpired(true);
    });

    newSocket.on("userCount", (count: number) => {
      setOnlineUsers(count);
    });

    setSocket(newSocket);

    // Fetch initial messages and chat details
    getChat(id)
      .then((chatData) => {
        if (new Date(chatData.chat.expires_at) < new Date()) {
          setChatExpired(true);
        } else {
          setMessages(
            chatData.messages.map((msg: Message) => ({
              ...msg,
              isCurrentUser: msg.sender === chatUserId,
            }))
          );
          setExpiresAt(new Date(chatData.chat.expires_at));
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching chat:", error);
        setChatExpired(true);
        setIsLoading(false);
      });

    return () => {
      console.log("Disconnecting socket");
      newSocket.disconnect();
      newSocket.off("userCount");
    };
  }, [id]);

  useEffect(() => {
    if (expiresAt) {
      const timer = setInterval(() => {
        const now = new Date();
        if (now >= expiresAt) {
          setTimeLeft("Expired");
          setChatExpired(true);
          clearInterval(timer);
        } else {
          setTimeLeft(formatTimeLeft(expiresAt));
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [expiresAt]);

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert("File size exceeds 10MB limit.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setAttachment({
          name: file.name,
          type: file.type,
          data: base64.split(",")[1], // Remove the data URL prefix
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "" && !attachment) return;

    if (socket && socket.connected) {
      const messageData: any = {
        chatId: id,
        sender: userId,
        content: inputMessage,
      };

      if (attachment) {
        messageData.attachment = {
          name: attachment.name,
          type: attachment.type,
          data: attachment.data,
        };
      }

      socket.emit("message", messageData);

      console.log("Message emitted to socket");
    } else {
      console.error("Socket not connected. Current socket state:", socket);
    }

    setInputMessage("");
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const isImageFile = (type: string) => {
    return type.startsWith("image/");
  };

  if (chatExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Chat Expired</h1>
          <p className="text-xl mb-8">This chat no longer exists.</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="bg-gray-800 p-4 flex items-center justify-between shadow-md h-16">
        <div className="flex items-center">
          <Lock className="h-6 w-6 text-indigo-400 mr-2" />
          <h1 className="text-xl font-bold">Voynich</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-300">
            <Users className="h-4 w-4 mr-1" />
            {onlineUsers} online
          </div>
          <div className="text-sm text-gray-300">Expires in: {timeLeft}</div>
        </div>
      </header>
      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto p-4 space-y-4"
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading messages...</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.isCurrentUser ? "items-end" : "items-start"
              }`}
            >
              <div className="text-xs text-gray-400 mb-1">
                {format(new Date(message.created_at), "MMM d, yyyy HH:mm")}
              </div>
              <div
                className={`max-w-[75%] p-3 rounded-lg ${
                  message.isCurrentUser
                    ? "bg-indigo-600 rounded-br-none"
                    : "bg-gray-700 rounded-bl-none"
                }`}
              >
                <p className="text-sm font-semibold mb-1">
                  {message.isCurrentUser
                    ? "Me"
                    : `User ${message.sender.slice(0, 4)}`}
                </p>
                <p className="break-words">{message.content}</p>
                {message.attachment && (
                  <div className="mt-2 flex items-center space-x-2">
                    {isImageFile(message.attachment.type) ? (
                      <img
                        src={`data:${message.attachment.type};base64,${message.attachment.data}`}
                        alt="Attachment"
                        className="max-w-full h-auto rounded object-contain"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 bg-gray-600 p-2 rounded">
                        <FileIcon className="h-6 w-6" />
                        <span className="text-sm text-gray-300 truncate max-w-[150px]">
                          {message.attachment.name}
                        </span>
                      </div>
                    )}
                    <a
                      href={`data:${message.attachment.type};base64,${message.attachment.data}`}
                      download={message.attachment.name}
                      className="bg-gray-600 hover:bg-gray-500 rounded-full p-2 flex-shrink-0"
                    >
                      <Download className="h-5 w-5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
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
            <div className="flex items-center justify-between bg-gray-700 p-2 rounded">
              <span className="text-sm text-gray-300 truncate">
                {attachment.name}
              </span>
              <Button
                type="button"
                onClick={removeAttachment}
                className="bg-red-600 hover:bg-red-700 rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </Button>
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
