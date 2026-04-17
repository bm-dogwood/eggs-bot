"use client";

import { useState, useEffect, useRef } from "react";
import { Check, X } from "lucide-react";

const rows = [
  {
    feature: "Freshness",
    farm: "1-3 days from farm",
    store: "2-6 weeks old",
  },
  {
    feature: "Nutrition",
    farm: "Higher omega-3 & vitamins",
    store: "Standard nutritional value",
  },
  {
    feature: "Farming Method",
    farm: "Pasture-raised, free-range",
    store: "Often caged or barn-raised",
  },
  {
    feature: "Taste",
    farm: "Rich, vibrant yolk flavor",
    store: "Mild, less distinct",
  },
  {
    feature: "Shell Strength",
    farm: "Thick, sturdy shells",
    store: "Thinner shells",
  },
  {
    feature: "Transparency",
    farm: "Know your farmer",
    store: "Unknown source",
  },
  {
    feature: "Color",
    farm: "Deep orange yolks",
    store: "Pale yellow yolks",
  },
  {
    feature: "Shelf Life",
    farm: "3-5 weeks refrigerated",
    store: "4-6 weeks refrigerated",
  },
];

const ComparisonTable = () => {
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

  return (
    <section ref={sectionRef} className="py-16 bg-slate-50" id="comparison">
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
              COMPARISON
            </span>
            <div className="w-12 h-0.5 bg-amber-300 ml-3"></div>
          </div>
          <h2 className="text-2xl md:text-5xl font-bold text-slate-800 mb-3">
            Farm Eggs vs Store Eggs
          </h2>
          <p className="text-sm text-gray-500">
            See the key differences between farm-fresh and store-bought eggs
          </p>
        </div>

        {/* Table */}
        <div
          className={`max-w-4xl mx-auto transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
              <div className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Feature
              </div>
              <div className="p-3 text-xs font-medium text-yellow-600 uppercase tracking-wider text-center border-x border-gray-200">
                Farm Eggs
              </div>
              <div className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                Store Eggs
              </div>
            </div>

            {/* Rows */}
            {rows.map((row, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 ${
                  index !== rows.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                {/* Feature */}
                <div className="p-3 text-sm text-gray-700 bg-white">
                  {row.feature}
                </div>

                {/* Farm */}
                <div className="p-3 text-sm bg-yellow-50/30 border-x border-gray-100 flex items-center justify-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />
                  <span className="text-yellow-700 text-xs">{row.farm}</span>
                </div>

                {/* Store */}
                <div className="p-3 text-sm bg-white flex items-center justify-center gap-1.5">
                  <X className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
                  <span className="text-gray-400 text-xs">{row.store}</span>
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className="grid grid-cols-3 bg-gray-50 p-3 border-t border-gray-200">
              <div className="text-xs font-medium text-gray-500">
                Best Choice
              </div>
              <div className="text-center">
                <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                  Farm Eggs
                </span>
              </div>
              <div className="text-center text-xs text-gray-400">
                Store Eggs
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
