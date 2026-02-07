import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Loader2, Shield } from "lucide-react";
import { askSecurityAI } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function SecurityChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm the Web3Guard Security Assistant. Ask me about XSS, CSP, Web2, Web3, or wallet security.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [cooldown, setCooldown] = useState(false); // 🔥 anti-429
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
      content: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setCooldown(true);

    // ⏳ 10s cooldown to avoid rate limit
    setTimeout(() => setCooldown(false), 10000);

    try {
      const aiReply = await askSecurityAI(userMsg.content);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiReply,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const msg =
        err.message === "RATE_LIMIT"
          ? "⚠️ Rate limit hit. Please wait 10 seconds."
          : "⚠️ AI service unavailable. Please try again.";

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-2">
            <Shield className="w-3 h-3" />
            <span>Security Specialist</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Ask Web3Guard</h1>
          <p className="text-xs text-muted-foreground mt-2">
            Frontend-only AI • Web2 & Web3 security
          </p>
        </div>

        {/* Chat Box */}
        <div className="flex-1 bg-card border border-white/10 rounded-2xl flex flex-col overflow-hidden">

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
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === "assistant"
                      ? "bg-primary/20 text-primary"
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
                  className={`max-w-[80%] px-4 py-3 text-sm rounded-2xl ${
                    msg.role === "assistant"
                      ? "bg-white/5 border border-white/5 text-gray-200 rounded-tl-none"
                      : "bg-primary text-primary-foreground rounded-tr-none"
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="px-4 py-3 bg-white/5 rounded-2xl flex gap-2">
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-150" />
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/5">
            <div className="relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about XSS, CSP, Web2, Web3, Wallet Security..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-5 pr-12 text-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim() || cooldown}
                className="absolute right-2 top-2 p-2 bg-primary rounded-lg"
              >
                {isTyping ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
