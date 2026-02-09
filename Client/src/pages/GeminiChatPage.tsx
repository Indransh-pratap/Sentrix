import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Loader2, Shield } from "lucide-react";
import { askGeminiAI } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function GeminiChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm Sentrix Security AI (Powered by Gemini). I can answer questions about Sentrix, cybersecurity vulnerabilities (XSS, SQLi, etc.), and scan remediation. How can I help?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping || cooldown) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setCooldown(true);

    // small UX cooldown
    setTimeout(() => setCooldown(false), 2000);

    try {
      const aiReply = await askGeminiAI(userMsg.content);

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
            <span>Restricted Security Bot</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Sentrix Assistant</h1>
          <p className="text-xs text-muted-foreground mt-2">
            Powered by Gemini • Strictly focused on Security & Sentrix
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
            <div className="relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about vulnerabilities, remediation, or Sentrix..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-5 pr-12 text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-muted-foreground/50"
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim() || cooldown}
                className="absolute right-2 top-2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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