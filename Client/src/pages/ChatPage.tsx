import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Loader2, Shield, Paperclip, X } from "lucide-react";
import { askSecurityAI } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachment?: {
    name: string;
    type: string;
    data: string; // base64
  };
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm Sentrix Security AI chatbot. I can answer questions about Sentrix, cybersecurity vulnerabilities (XSS, SQLi, etc.), and scan remediation. How can I help?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [attachment, setAttachment] = useState<{ name: string; type: string; data: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAttachment({
            name: file.name,
            type: file.type,
            data: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !attachment) || isTyping || cooldown) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      attachment: attachment || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAttachment(null);
    setIsTyping(true);
    setCooldown(true);

    // small UX cooldown
    setTimeout(() => setCooldown(false), 2000);

    try {
      const aiReply = await askSecurityAI(userMsg.content, userMsg.attachment);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: aiReply,
        },
      ]);
    } catch (err: any) {
      const msg = "⚠️ I encountered an error. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: msg,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 flex flex-col">
      <div className="container mx-auto px-4 max-w-3xl flex-1 flex flex-col">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-2">
            <Shield className="w-3 h-3" />
          </div>
          <h1 className="text-2xl font-bold text-white">Sentrix Assistant</h1>
          <p className="text-xs text-muted-foreground mt-2">
            Strictly focused on Security & Sentrix
          </p>
        </div>

        {/* Chat Box */}
        <div className="flex-1 bg-card border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "assistant"
                      ? "bg-blue-600/20 text-blue-400"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>

                <div
                  className={`max-w-[85%] px-4 py-3 text-sm rounded-2xl leading-relaxed ${
                    msg.role === "assistant"
                      ? "bg-white/5 border border-white/5 text-gray-200 rounded-tl-none"
                      : "bg-blue-600 text-white rounded-tr-none"
                  }`}
                >
                  {msg.attachment && (
                    <div className="mb-2 p-2 bg-black/20 rounded border border-white/10">
                      {msg.attachment.type.startsWith('image/') ? (
                         <img src={msg.attachment.data} alt="attachment" className="max-w-full h-auto rounded" />
                      ) : (
                         <div className="flex items-center gap-2">
                           <Paperclip className="w-4 h-4" />
                           <span className="text-xs truncate">{msg.attachment.name}</span>
                         </div>
                      )}
                    </div>
                  )}
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-400" />
                </div>
                <div className="px-4 py-3 bg-white/5 rounded-2xl flex gap-2 items-center">
                  <span className="w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-black/20">
            {attachment && (
              <div className="flex items-center gap-2 mb-2 p-2 bg-white/5 rounded-lg border border-white/10 w-fit">
                <span className="text-xs text-gray-300 max-w-[200px] truncate">{attachment.name}</span>
                <button 
                  type="button" 
                  onClick={() => setAttachment(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <div className="relative flex items-center gap-2">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf,.txt,.log"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Attach file"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about vulnerabilities..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-muted-foreground/50"
              />
              <button
                type="submit"
                disabled={isTyping || (!input.trim() && !attachment) || cooldown}
                className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isTyping ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="text-center mt-2">
                <span className="text-[10px] text-muted-foreground/40">
                    AI may produce inaccurate information. Strictly limited to security topics.
                </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}