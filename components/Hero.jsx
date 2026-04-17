import { Egg, ArrowRight } from "lucide-react";

const floatingEggs = [
  { top: "15%", left: "8%", delay: 0, size: 28 },
  { top: "25%", right: "12%", delay: 1.2, size: 22 },
  { top: "60%", left: "5%", delay: 0.6, size: 18 },
  { top: "70%", right: "8%", delay: 1.8, size: 24 },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16 bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #f97316 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1587486913049-53fc88980cfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Farm fresh eggs in a basket"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/100 via-white/30 to-white/10" />
      </div>

      {/* Main content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-2xl animate-fadeInUp">
          {/* Badge */}
          <div className="inline-flex items-center justify-center mb-4">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-12 h-0.5 bg-amber-300 mr-3"></div>
              <span className="text-amber-500 font-semibold tracking-wider text-sm">
                FARM TO TABLE
              </span>
              <div className="w-12 h-0.5 bg-amber-300 ml-3"></div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Fresh Farm Eggs{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              Powered by Automation
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
            Learn about egg quality, nutrition, cooking techniques, and
            subscribe to farm-fresh eggs delivered directly from local farms.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white font-medium rounded-full hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base">
              <span>Ask EggBot</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-amber-600 text-amber-600 font-medium rounded-full hover:bg-amber-50 transition-all duration-300 hover:-translate-y-0.5 text-base">
              <Egg className="h-4 w-4" />
              Start Egg Subscription
            </button>
          </div>

          {/* Stats Section (New) */}
          <div className="mt-12 flex items-center gap-8">
            <div>
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-500">Happy Farms</div>
            </div>
            <div className="w-px h-8 bg-gray-300" />
            <div>
              <div className="text-2xl font-bold text-gray-900">50K+</div>
              <div className="text-sm text-gray-500">Subscribers</div>
            </div>
            <div className="w-px h-8 bg-gray-300" />
            <div>
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-500">Free Range</div>
            </div>
          </div>

          {/* Trust Badges (New) */}
          <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span className="text-amber-500">✓</span> Free delivery
            </span>
            <span className="flex items-center gap-1">
              <span className="text-amber-500">✓</span> Farm fresh
            </span>
            <span className="flex items-center gap-1">
              <span className="text-amber-500">✓</span> Cancel anytime
            </span>
          </div>
        </div>
      </div>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float ease-in-out infinite;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
