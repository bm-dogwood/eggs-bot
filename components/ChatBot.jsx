"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, Send, User, Egg, Sparkles, EggFried } from "lucide-react";

const presetQuestions = [
  "How long do eggs stay fresh?",
  "What egg grade is best for baking?",
  "How should eggs be stored?",
  "What's the float test?",
  "How to tell if an egg is fresh?",
  "Best eggs for boiling?",
];

const answers = {
  "How long do eggs stay fresh?":
    "Fresh farm eggs typically stay fresh for 3-5 weeks when refrigerated at 40°F or below. For best quality, use within 3 weeks of purchase! 🥚",
  "What egg grade is best for baking?":
    "Grade A eggs are ideal for baking! They have firm whites and round yolks, perfect for cakes, cookies, and pastries. 🎂",
  "How should eggs be stored?":
    "Store eggs in their original carton on a refrigerator shelf (not the door). Keep them at 40°F or below, pointed end down. ❄️",
  "What's the float test?":
    "Place an egg in water. Fresh eggs sink and lay flat. Slightly older eggs stand upright. If it floats, it's past its prime! 💧",
  "How to tell if an egg is fresh?":
    "Besides the float test, fresh eggs have thick whites, round yolks, and no odor. The shell should be clean and uncracked. 🔍",
  "Best eggs for boiling?":
    "Slightly older eggs (1-2 weeks old) are actually best for boiling! They peel more easily. Add salt to water for easier peeling. 🍳",
};

const EggBotChat = () => {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm EggBot 🥚 Ask me anything about eggs — freshness, grades, cooking, or storage!",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef(null);
  const sectionRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === sectionRef.current) {
            setIsVisible(entry.isIntersecting);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const ask = (question) => {
    if (!question.trim()) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: question,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    // Show typing indicator
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            answers[question] ||
            "Great question! Our egg experts are working on that answer. Try one of the preset questions! 🥚",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setIsTyping(false);
    }, 1000);

    setInputValue("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      ask(inputValue);
    }
  };

  return (
    <section
      id="eggbot"
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-b from-white to-amber-50 relative overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-amber-200 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-amber-200 rounded-full blur-3xl" />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          w-96 h-96 bg-amber-100 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div
          className={`text-center mb-12 transition-all duration-700 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-0.5 bg-amber-300 mr-3"></div>
            <span className="text-amber-600 font-semibold tracking-wider text-sm">
              AI POWERED BOT
            </span>
            <div className="w-12 h-0.5 bg-amber-300 ml-3"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ask{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              EggBot
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Your smart egg assistant. Get instant answers about freshness,
            cooking techniques, storage tips, and egg quality.
          </p>
        </div>

        {/* Chat Container */}
        <div
          ref={chatRef}
          className={`max-w-2xl mx-auto transition-all duration-700 delay-300 transform ${
            isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-10 scale-95"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-100">
            {/* Chat Header */}
            <div
              className="bg-amber-500 px-6 py-4 
              flex items-center gap-3"
            >
              <div className="relative">
                <span
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 
                  rounded-full border-2 border-white animate-pulse"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">Egg.Bot Assistant</h3>
                <p className="text-xs text-white/80">Online • Ready to help</p>
              </div>
            </div>

            {/* Messages Area */}
            <div
              className="h-96 overflow-y-auto p-6 bg-gray-50/50"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 10px 10px, #fef3c7 1px, transparent 0)",
                backgroundSize: "30px 30px",
              }}
            >
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    } 
                      animate-fadeInUp`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {msg.role === "bot" && (
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <EggFried className="h-4 w-4 text-amber-600" />
                      </div>
                    )}

                    <div
                      className={`max-w-[70%] ${
                        msg.role === "user" ? "order-1" : ""
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                            : "bg-white text-gray-800 shadow-md border border-amber-100"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <span className="text-xs text-gray-400 mt-1 block px-2">
                        {msg.timestamp}
                      </span>
                    </div>

                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-amber-100">
                      <div className="flex gap-1">
                        <span
                          className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-amber-100 bg-white"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your question here..."
                  className="flex-1 px-4 py-3 rounded-xl border border-amber-200 
                    focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                    placeholder:text-gray-400 text-gray-700"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 
                    text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-700 
                    transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                    shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* Preset Questions */}
            <div className="px-4 py-3 bg-amber-50/80 border-t border-amber-100">
              <p className="text-xs text-amber-700 font-medium mb-2 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Popular questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {presetQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => ask(q)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white text-gray-700 
                      hover:bg-amber-500 hover:text-white transition-all duration-300 
                      shadow-sm hover:shadow-md border border-amber-200 hover:border-transparent
                      transform hover:-translate-y-0.5"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out forwards;
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
    </section>
  );
};

export default EggBotChat;
