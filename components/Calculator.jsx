"use client";

import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  CalendarDays,
  Clock,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronDown,
} from "lucide-react";

const FreshnessCalculator = () => {
  const [purchaseDate, setPurchaseDate] = useState("");
  const [result, setResult] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const sectionRef = useRef(null);

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

  const calculate = () => {
    if (!purchaseDate) return;

    const purchase = new Date(purchaseDate);
    const today = new Date();

    purchase.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const days = Math.floor((today - purchase) / (1000 * 60 * 60 * 24));

    if (days < 0) return;

    if (days <= 7) {
      setResult({
        status: "Premium Fresh",
        days,
        color: "text-yellow-300",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/30",
        icon: CheckCircle2,
        description:
          "Eggs are at peak freshness. Ideal for any preparation method.",
        recommendations: [
          "Perfect for poaching and frying",
          "Ideal for mayonnaise and raw preparations",
          "Best egg white volume for meringues",
          "Superior for baking applications",
        ],
        shelfLife: "3-4 weeks remaining",
        storageTemp: "40°F (4°C) or below",
        tip: "Farm-fresh eggs have firm whites and bright golden yolks",
      });
    } else if (days <= 14) {
      setResult({
        status: "Fresh",
        days,
        color: "text-amber-300",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/30",
        icon: CheckCircle2,
        description:
          "Excellent quality eggs suitable for most culinary applications.",
        recommendations: [
          "Great for scrambled eggs and omelets",
          "Suitable for most baking recipes",
          "Good for hard boiling",
          "Works well in quiches and frittatas",
        ],
        shelfLife: "2-3 weeks remaining",
        storageTemp: "40°F (4°C) or below",
        tip: "Perfect for daily cooking and baking",
      });
    } else if (days <= 21) {
      setResult({
        status: "Good",
        days,
        color: "text-orange-300",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/30",
        icon: AlertCircle,
        description:
          "Still good quality. Older eggs are easier to peel when hard-boiled.",
        recommendations: [
          "Ideal for hard-boiled eggs",
          "Perfect for egg salad",
          "Good for baking",
          "Suitable for scrambling",
        ],
        shelfLife: "1-2 weeks remaining",
        storageTemp: "40°F (4°C) or below",
        tip: "Great for making classic egg salad",
      });
    } else if (days <= 28) {
      setResult({
        status: "Use Promptly",
        days,
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/30",
        icon: AlertCircle,
        description: "Eggs remain safe for consumption when properly stored.",
        recommendations: [
          "Best for hard boiling",
          "Suitable for baking",
          "OK for scrambling",
          "Perform float test before use",
        ],
        shelfLife: "Less than 1 week remaining",
        storageTemp: "40°F (4°C) or below",
        tip: "Perfect for Easter egg decorating",
      });
    } else {
      setResult({
        status: "Evaluate",
        days,
        color: "text-red-300",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        icon: AlertTriangle,
        description:
          "Eggs require evaluation before consumption. Perform float test.",
        recommendations: [
          "Conduct float test immediately",
          "Discard if eggs float",
          "Use only for thoroughly cooked dishes",
          "Not recommended for raw preparations",
        ],
        shelfLife: "Beyond recommended storage",
        storageTemp: "40°F (4°C) or below",
        tip: "Always trust your nose - bad eggs have a distinct sulfur smell",
      });
    }
  };

  const getProgressPercentage = (days) => {
    const maxDays = 35;
    const percentage = ((maxDays - days) / maxDays) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getProgressColor = (days) => {
    if (days <= 14) return "bg-gradient-to-r from-yellow-400 to-amber-400";
    if (days <= 28) return "bg-gradient-to-r from-amber-400 to-orange-400";
    return "bg-gradient-to-r from-orange-400 to-red-400";
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-gray-900 min-h-screen flex items-center"
      id="calculator"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-0.5 bg-amber-300 mr-3"></div>
            <span className="text-amber-600 font-semibold tracking-wider text-sm">
              AI POWERED CALCULATOR
            </span>
            <div className="w-12 h-0.5 bg-amber-300 ml-3"></div>
          </div>
          <h2 className="text-2xl md:text-3xl font-medium text-yellow-100 mb-3">
            Egg Freshness Calculator
          </h2>
          <p className="text-sm text-gray-400">
            Track the freshness of your eggs from farm to table
          </p>
        </div>

        {/* Calculator Card */}
        <div
          className={`max-w-lg mx-auto transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="bg-gray-800/90 rounded-xl border border-yellow-900/50 overflow-hidden backdrop-blur-sm">
            {/* Input Section */}
            <div className="p-5 border-b border-yellow-900/30">
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-yellow-200">Purchase Date</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-yellow-800/50 rounded-lg 
                    text-yellow-100 text-sm focus:outline-none focus:border-yellow-600"
                />
                <button
                  onClick={calculate}
                  disabled={!purchaseDate}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-amber-600 
                    text-white text-sm font-medium rounded-lg hover:from-yellow-500 
                    hover:to-amber-500 transition-colors disabled:opacity-50 
                    disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Check
                </button>
              </div>
            </div>

            {/* Result Section */}
            {result && (
              <div className="p-5">
                {/* Status */}
                <div
                  className={`flex items-start gap-3 p-3 ${result.bgColor} rounded-lg mb-4 border ${result.borderColor}`}
                >
                  <result.icon
                    className={`h-5 w-5 ${result.color} flex-shrink-0 mt-0.5`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium ${result.color}`}>
                        {result.status}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-gray-700 rounded-full text-yellow-200">
                        {result.days} days
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">
                      {result.description}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>🥚 Fresh</span>
                    <span>📋 Check</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(
                        result.days
                      )} transition-all duration-500`}
                      style={{
                        width: `${getProgressPercentage(result.days)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Quick Tip */}
                <div className="mb-4 p-3 bg-gray-700/50 rounded-lg border border-yellow-900/30">
                  <p className="text-sm text-yellow-200">
                    <span className="text-yellow-400 font-medium">
                      🥚 Tip:{" "}
                    </span>
                    {result.tip}
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-gray-700/30 rounded-lg border border-yellow-900/30">
                    <div className="text-xs text-yellow-400 mb-1">
                      Purchase Date
                    </div>
                    <div className="text-sm text-yellow-100">
                      {formatDate(purchaseDate)}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-700/30 rounded-lg border border-yellow-900/30">
                    <div className="text-xs text-yellow-400 mb-1">Store At</div>
                    <div className="text-sm text-yellow-100">
                      {result.storageTemp}
                    </div>
                  </div>
                </div>

                {/* Details Dropdown */}
                <div className="border border-yellow-900/30 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full px-4 py-2.5 flex items-center justify-between 
                      bg-gray-700/50 text-yellow-200 hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-sm font-medium">
                      📋 Recommendations
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        showDetails ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showDetails && (
                    <div className="p-3 bg-gray-800">
                      <ul className="space-y-1.5 mb-3">
                        {result.recommendations.map((rec, index) => (
                          <li
                            key={index}
                            className="text-xs text-gray-400 flex items-start gap-2"
                          >
                            <span className="text-yellow-600">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                      <div className="pt-2 border-t border-yellow-900/30">
                        <div className="flex justify-between text-xs">
                          <span className="text-yellow-400">Shelf life:</span>
                          <span className="text-yellow-200 font-medium">
                            {result.shelfLife}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Float Test */}
                <div className="mt-4 p-3 bg-gray-700/30 rounded-lg border border-yellow-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-3.5 w-3.5 text-yellow-400" />
                    <span className="text-xs text-yellow-300">
                      Float Test Guide
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <div className="text-yellow-300 mb-1">🥚⬇️</div>
                      <div className="text-gray-400">Sinks → Fresh</div>
                    </div>
                    <div>
                      <div className="text-yellow-300 mb-1">🥚📐</div>
                      <div className="text-gray-400">Upright → Use soon</div>
                    </div>
                    <div>
                      <div className="text-yellow-300 mb-1">🥚⬆️</div>
                      <div className="text-gray-400">Floats → Discard</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!result && (
              <div className="p-8 text-center">
                <div className="text-5xl mb-3">🥚</div>
                <p className="text-yellow-200 text-sm mb-1">
                  Select a purchase date
                </p>
                <p className="text-xs text-gray-500">
                  Enter when you bought your eggs to check freshness
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreshnessCalculator;
