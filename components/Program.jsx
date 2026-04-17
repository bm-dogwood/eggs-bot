"use client";

import { useState, useEffect, useRef } from "react";
import {
  Gift,
  Copy,
  Check,
  Users,
  DollarSign,
  Package,
  Egg,
  Sparkles,
} from "lucide-react";

// Referral Program Component
const ReferralProgram = () => {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const referralLink = "https://eggs.bot/ref/FARM2TABLE";
  const referralCode = "FARM2TABLE";

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

  const copy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section ref={sectionRef} className="py-16 bg-white" id="sub">
      <div className="container mx-auto px-4">
        <div
          className={`max-w-2xl mx-auto transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-12 h-0.5 bg-amber-300 mr-3"></div>
              <span className="text-amber-600 font-semibold tracking-wider text-sm">
                REFER AND EARN
              </span>
              <div className="w-12 h-0.5 bg-amber-300 ml-3"></div>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Share the Freshness
            </h2>

            <p className="text-gray-500 text-base max-w-md mx-auto">
              Invite friends and you both get{" "}
              <span className="font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                $5 off
              </span>{" "}
              your next delivery.
            </p>
          </div>

          {/* Referral Card */}
          <div className="bg-white border border-amber-100 rounded-xl p-5 mb-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Code Display */}
            <div className="mb-4">
              <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <span>Your referral code</span>
                <Sparkles className="h-3 w-3 text-amber-400" />
              </div>
              <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                <span className="text-xl font-mono font-medium text-amber-700 tracking-wider">
                  {referralCode}
                </span>
              </div>
            </div>

            {/* Link Display */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-500 truncate block">
                  {referralLink}
                </span>
              </div>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium min-w-[80px] justify-center"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              {
                value: "3",
                label: "Referrals",
                icon: Users,
                color: "text-blue-500",
                bg: "bg-blue-50",
              },
              {
                value: "$15",
                label: "Saved",
                icon: DollarSign,
                color: "text-green-500",
                bg: "bg-green-50",
              },
              {
                value: "Free",
                label: "Next box",
                icon: Package,
                color: "text-amber-500",
                bg: "bg-amber-50",
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="text-center p-3 bg-white border border-gray-100 rounded-lg hover:border-amber-200 transition-colors"
                >
                  <div
                    className={`w-8 h-8 mx-auto mb-2 ${stat.bg} rounded-full flex items-center justify-center`}
                  >
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div className="text-base font-semibold text-gray-800">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* How it works */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Simple 3-step process
            </h3>
            <div className="space-y-3">
              {[
                "Share your unique referral link",
                "Friend places first order",
                "You both get $5 credit",
              ].map((text, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-600">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Terms */}
          <p className="text-xs text-center text-gray-300 mt-4">
            * Credits apply to next delivery. Minimum order $15. One referral
            per friend.
          </p>
        </div>
      </div>
    </section>
  );
};

// Subscription Plans Component
const SubscriptionPlans = () => {
  const [isVisible, setIsVisible] = useState(false);
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

  const plans = [
    {
      name: "Starter",
      eggs: 12,
      price: "$9.99",
      period: "/week",
      features: [
        "12 pasture-raised eggs",
        "Weekly delivery",
        "Grade A quality",
        "Free packaging",
      ],
      popular: false,
      color: "blue",
      icon: "",
    },
    {
      name: "Family",
      eggs: 24,
      price: "$17.99",
      period: "/week",
      features: [
        "24 pasture-raised eggs",
        "Weekly delivery",
        "Grade AA quality",
        "Priority support",
        "Recipe booklet",
      ],
      popular: true,
      color: "amber",
      icon: "",
    },
    {
      name: "Chef",
      eggs: 36,
      price: "$24.99",
      period: "/week",
      features: [
        "36 pasture-raised eggs",
        "Weekly delivery",
        "Grade AA quality",
        "Priority support",
        "Recipe booklet",
        "Farm tour access",
      ],
      popular: false,
      color: "emerald",
      icon: "",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="plans"
      className="py-16 bg-gradient-to-b from-white to-amber-50/30"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-0.5 bg-amber-300 mr-3"></div>
            <span className="text-amber-600 font-semibold tracking-wider text-sm">
              FARM SUBSCRIPTION
            </span>
            <div className="w-12 h-0.5 bg-amber-300 ml-3"></div>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Fresh Eggs, <span className="text-amber-600">Weekly</span>
          </h2>

          <p className="text-gray-500 text-base max-w-md mx-auto">
            Choose the plan that fits your household. Cancel or pause anytime.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-xl border ${
                plan.popular
                  ? "border-amber-200 shadow-lg scale-105 md:scale-105"
                  : "border-gray-200 shadow-sm hover:shadow-md"
              } transition-all duration-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-600 text-white text-xs font-medium rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}

              {/* Header */}
              <div className="p-6 text-center border-b border-gray-100">
                <div className="text-3xl mb-2">{plan.icon}</div>
                <h3 className="text-lg  text-gray-900">{plan.name}</h3>
                <p className="text-xs text-gray-400 mb-3">
                  {plan.eggs} fresh eggs weekly
                </p>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-sm text-gray-400">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <div className="p-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check
                        className={`h-4 w-4 text-${
                          plan.popular ? "amber" : "gray"
                        }-500 flex-shrink-0 mt-0.5`}
                      />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer */}
              <div className="p-6 pt-0">
                <button
                  className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                    plan.popular
                      ? "bg-amber-600 text-white hover:bg-amber-700"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Subscribe Now
                </button>

                {plan.popular && (
                  <p className="text-xs text-center text-amber-600 mt-2">
                    Best value for families
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          {[
            { label: "Free delivery", icon: "" },
            { label: "Cancel anytime", icon: "" },
            { label: "Farm fresh", icon: "" },
            { label: "Satisfaction guaranteed", icon: "" },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-gray-200 text-sm"
            >
              <span>{badge.icon}</span>
              <span className="text-gray-600 text-xs">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Combined Component
const ReferralAndPlans = () => {
  return (
    <>
      <SubscriptionPlans />
      <ReferralProgram />
    </>
  );
};

export default ReferralAndPlans;
