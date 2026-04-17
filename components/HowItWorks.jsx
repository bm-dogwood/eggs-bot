"use client";

import { Egg, ScanSearch, Package, Truck } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const steps = [
  {
    icon: Egg,
    title: "Farm Collection",
    desc: "Local farms collect pasture-raised eggs daily from free-roaming chickens.",
    color: "text-emerald-600",
  },
  {
    icon: ScanSearch,
    title: "Auto Grading",
    desc: "Eggs are automatically graded and inspected for quality and freshness.",
    color: "text-amber-600",
  },
  {
    icon: Package,
    title: "Fresh Packing",
    desc: "Orders are carefully packed to preserve freshness during transit.",
    color: "text-orange-600",
  },
  {
    icon: Truck,
    title: "Doorstep Delivery",
    desc: "Customers receive farm-fresh eggs weekly at their doorstep.",
    color: "text-stone-600",
  },
];

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stepVisibility, setStepVisibility] = useState([
    false,
    false,
    false,
    false,
  ]);
  const sectionRef = useRef(null);
  const stepRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === sectionRef.current) {
            setIsVisible(entry.isIntersecting);
          } else {
            const index = stepRefs.current.findIndex(
              (ref) => ref === entry.target
            );
            if (index !== -1 && entry.isIntersecting) {
              setStepVisibility((prev) => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px" }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="min-h-screen py-16 md:py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-200 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-700 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-0.5 bg-amber-300 mr-3"></div>
            <span className="text-amber-600 font-semibold tracking-wider text-sm">
              THE PROCESS
            </span>
            <div className="w-12 h-0.5 bg-amber-300 ml-3"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            From Farm to Fork in{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              Four Simple Steps
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Our automated farm-to-table process ensures you get the freshest
            eggs possible, with complete transparency from collection to
            delivery.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isStepVisible = stepVisibility[i];

            return (
              <div
                key={i}
                ref={(el) => (stepRefs.current[i] = el)}
                className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 
                  shadow-lg hover:shadow-2xl transition-all duration-700 transform
                  border border-amber-100 hover:border-amber-300
                  ${
                    isStepVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-16"
                  }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {/* Step number badge */}
                <div
                  className="absolute -top-3 -right-3 w-8 h-8 bg-amber-500 text-white 
                  rounded-full flex items-center justify-center font-bold text-sm shadow-lg
                  group-hover:scale-110 transition-transform"
                >
                  {i + 1}
                </div>

                {/* Icon container */}
                <div
                  className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 
                  rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 mb-6
                  group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                >
                  <Icon
                    className={`w-8 h-8 md:w-10 md:h-10 ${step.color} 
                    group-hover:scale-110 transition-transform duration-300`}
                  />
                </div>

                {/* Content */}
                <h3
                  className="font-bold text-xl md:text-2xl text-gray-900 mb-3 
                  group-hover:text-amber-600 transition-colors"
                >
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {step.desc}
                </p>

                {/* Hover effect line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r 
                  from-amber-400 to-orange-500 rounded-b-2xl transform scale-x-0 
                  group-hover:scale-x-100 transition-transform duration-500 origin-left"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .hover-lift {
          transition: transform 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-8px);
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
