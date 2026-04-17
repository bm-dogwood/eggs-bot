// "use client";

// import { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import { Clock, ChefHat, Utensils, Search, Filter } from "lucide-react";

// const recipes = [
//   {
//     name: "Classic Omelet",
//     time: "10 min",
//     difficulty: "Easy",
//     meal: "Breakfast",
//     desc: "Fluffy eggs with your choice of fillings.",
//     image:
//       "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     calories: "280",
//     protein: "18g",
//   },
//   {
//     name: "Scrambled Eggs",
//     time: "5 min",
//     difficulty: "Easy",
//     meal: "Breakfast",
//     desc: "Creamy, buttery scrambled eggs on toast.",
//     image:
//       "https://images.unsplash.com/photo-1505253304499-671c55fb57fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     calories: "320",
//     protein: "20g",
//   },
//   {
//     name: "Egg Fried Rice",
//     time: "15 min",
//     difficulty: "Medium",
//     meal: "Lunch",
//     desc: "Wok-fried rice with eggs and vegetables.",
//     image:
//       "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     calories: "350",
//     protein: "12g",
//   },
//   {
//     name: "Egg Salad",
//     time: "20 min",
//     difficulty: "Easy",
//     meal: "Lunch",
//     desc: "Classic egg salad with mayo and herbs.",
//     image:
//       "https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     calories: "290",
//     protein: "14g",
//   },
//   {
//     name: "Eggs Benedict",
//     time: "30 min",
//     difficulty: "Hard",
//     meal: "Breakfast",
//     desc: "Poached eggs with hollandaise on muffins.",
//     image:
//       "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     calories: "450",
//     protein: "22g",
//   },
//   {
//     name: "Shakshuka",
//     time: "25 min",
//     difficulty: "Medium",
//     meal: "Dinner",
//     desc: "Eggs poached in spiced tomato sauce.",
//     image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHU4WlevASpGhP13o3HRMXxOWp1CLJIMx3v1c0T1bZld-nEVuz9H7WwFmgHjSuIQBjA5IOQvNCDJGUez4JcgLo1tu2sMJ0SjSpkP3oXA&s=10",
//     calories: "310",
//     protein: "16g",
//   },
//   {
//     name: "Quiche Lorraine",
//     time: "45 min",
//     difficulty: "Hard",
//     meal: "Dinner",
//     desc: "Savory egg custard pie with bacon.",
//     image:
//       "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     calories: "520",
//     protein: "24g",
//   },
//   {
//     name: "Egg Drop Soup",
//     time: "10 min",
//     difficulty: "Easy",
//     meal: "Dinner",
//     desc: "Simple, comforting Chinese egg soup.",
//     image:
//       "https://static01.nyt.com/images/2024/10/28/multimedia/Egg-Drop-Souprex-lhwp/Egg-Drop-Souprex-lhwp-mediumSquareAt3X.jpg",
//     calories: "180",
//     protein: "10g",
//   },
// ];

// const times = ["Any", "< 15 min", "15-30 min", "30+ min"];
// const difficulties = ["Any", "Easy", "Medium", "Hard"];
// const meals = ["Any", "Breakfast", "Lunch", "Dinner"];

// const Selector = ({ label, icon: Icon, options, value, onChange }) => (
//   <div className="space-y-2">
//     <div className="flex items-center gap-2">
//       <Icon className="h-4 w-4 text-amber-600" />
//       <span className="text-sm font-medium text-gray-700">{label}</span>
//     </div>
//     <div className="flex flex-wrap gap-2">
//       {options.map((o) => (
//         <button
//           key={o}
//           onClick={() => onChange(o)}
//           className={`px-4 py-2 text-sm rounded-full transition-all duration-300 transform hover:scale-105 ${
//             value === o
//               ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md"
//               : "bg-white text-gray-600 hover:bg-amber-50 border border-amber-200"
//           }`}
//         >
//           {o}
//         </button>
//       ))}
//     </div>
//   </div>
// );

// const RecipeGenerator = () => {
//   const [time, setTime] = useState("Any");
//   const [diff, setDiff] = useState("Any");
//   const [meal, setMeal] = useState("Any");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isVisible, setIsVisible] = useState(false);
//   const [hoveredCard, setHoveredCard] = (useState < number) | (null > null);
//   const sectionRef = useRef < HTMLElement > null;

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.target === sectionRef.current) {
//             setIsVisible(entry.isIntersecting);
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     const currentRef = sectionRef.current;
//     if (currentRef) observer.observe(currentRef);

//     return () => {
//       if (currentRef) observer.unobserve(currentRef);
//       observer.disconnect();
//     };
//   }, []);

//   const filtered = recipes.filter((r) => {
//     const timeMatch =
//       time === "Any" ||
//       (time === "< 15 min" && parseInt(r.time) < 15) ||
//       (time === "15-30 min" &&
//         parseInt(r.time) >= 15 &&
//         parseInt(r.time) <= 30) ||
//       (time === "30+ min" && parseInt(r.time) > 30);

//     const diffMatch = diff === "Any" || r.difficulty === diff;
//     const mealMatch = meal === "Any" || r.meal === meal;
//     const searchMatch =
//       r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       r.desc.toLowerCase().includes(searchTerm.toLowerCase());

//     return timeMatch && diffMatch && mealMatch && searchMatch;
//   });

//   // Configure Next.js Image domains in next.config.js
//   // Add the domains for the image URLs used above

//   return (
//     <section
//       id="recipes"
//       ref={sectionRef}
//       className="py-16 md:py-24 bg-gradient-to-br from-white via-amber-50 to-white relative overflow-hidden"
//     >
//       {/* Decorative elements */}
//       <div className="absolute inset-0">
//         <div className="absolute top-0 left-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-30" />
//         <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-100 rounded-full blur-3xl opacity-30" />
//       </div>

//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
//         {/* Header */}
//         <div
//           className={`text-center mb-12 transition-all duration-700 transform ${
//             isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
//           }`}
//         >
//           <div className="inline-flex items-center justify-center mb-4">
//             <div className="w-12 h-0.5 bg-amber-300 mr-3"></div>
//             <span className="text-amber-600 font-semibold tracking-wider text-sm">
//               RECIPE FINDER
//             </span>
//             <div className="w-12 h-0.5 bg-amber-300 ml-3"></div>
//           </div>
//           <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//             Find Your Perfect{" "}
//             <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
//               Egg Recipe
//             </span>
//           </h2>
//           <p className="text-gray-600 max-w-2xl mx-auto text-lg">
//             Discover delicious egg recipes tailored to your preferences. Filter
//             by time, difficulty, and meal type.
//           </p>
//         </div>

//         {/* Filters Card */}
//         <div
//           className={`max-w-4xl mx-auto transition-all duration-700 delay-200 transform ${
//             isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
//           }`}
//         >
//           <div
//             className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8
//             border border-amber-100"
//           >
//             {/* Search Bar */}
//             <div className="mb-6">
//               <div className="relative">
//                 <Search
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2
//                   text-gray-400 h-5 w-5"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search recipes..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 rounded-xl border border-amber-200
//                     focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
//                     placeholder:text-gray-400"
//                 />
//               </div>
//             </div>

//             {/* Filter Options */}
//             <div className="grid sm:grid-cols-3 gap-6">
//               <Selector
//                 label="Cooking Time"
//                 icon={Clock}
//                 options={times}
//                 value={time}
//                 onChange={setTime}
//               />
//               <Selector
//                 label="Difficulty"
//                 icon={ChefHat}
//                 options={difficulties}
//                 value={diff}
//                 onChange={setDiff}
//               />
//               <Selector
//                 label="Meal Type"
//                 icon={Utensils}
//                 options={meals}
//                 value={meal}
//                 onChange={setMeal}
//               />
//             </div>

//             {/* Active Filters */}
//             <div className="mt-4 pt-4 border-t border-amber-100 flex items-center gap-2">
//               <Filter className="h-4 w-4 text-amber-600" />
//               <span className="text-sm text-gray-600">Active filters:</span>
//               <div className="flex gap-2">
//                 {time !== "Any" && (
//                   <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
//                     {time}
//                   </span>
//                 )}
//                 {diff !== "Any" && (
//                   <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
//                     {diff}
//                   </span>
//                 )}
//                 {meal !== "Any" && (
//                   <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
//                     {meal}
//                   </span>
//                 )}
//                 {time === "Any" && diff === "Any" && meal === "Any" && (
//                   <span className="text-sm text-gray-400">
//                     No filters applied
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Results Count */}
//           <div className="mb-4 text-sm text-gray-500">
//             Found{" "}
//             <span className="font-bold text-amber-600">{filtered.length}</span>{" "}
//             recipes
//           </div>

//           {/* Recipe Grid */}
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {filtered.map((r, i) => (
//               <div
//                 key={r.name}
//                 className={`group relative bg-white rounded-xl overflow-hidden shadow-lg
//                   hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2
//                   border border-amber-100 cursor-pointer
//                   ${
//                     isVisible
//                       ? "opacity-100 translate-y-0"
//                       : "opacity-0 translate-y-10"
//                   }`}
//                 style={{ transitionDelay: `${i * 100 + 400}ms` }}
//                 onMouseEnter={() => setHoveredCard(i)}
//                 onMouseLeave={() => setHoveredCard(null)}
//               >
//                 {/* Image Container */}
//                 <div className="relative h-40 overflow-hidden">
//                   <Image
//                     src={r.image}
//                     alt={r.name}
//                     fill
//                     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
//                     className={`object-cover transition-transform duration-700
//                       ${hoveredCard === i ? "scale-110" : "scale-100"}`}
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

//                   {/* Meal Type Badge */}
//                   <span
//                     className="absolute top-2 right-2 px-2 py-1 bg-white/90
//                     backdrop-blur-sm text-xs font-medium rounded-full text-amber-700 z-10"
//                   >
//                     {r.meal}
//                   </span>
//                 </div>

//                 {/* Content */}
//                 <div className="p-4">
//                   <h3
//                     className="font-bold text-gray-900 mb-1 group-hover:text-amber-600
//                     transition-colors"
//                   >
//                     {r.name}
//                   </h3>
//                   <p className="text-xs text-gray-500 mb-3 line-clamp-2">
//                     {r.desc}
//                   </p>

//                   {/* Tags */}
//                   <div className="flex gap-2 mb-3">
//                     <span
//                       className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full
//                       text-xs font-medium"
//                     >
//                       {r.time}
//                     </span>
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         r.difficulty === "Easy"
//                           ? "bg-green-100 text-green-700"
//                           : r.difficulty === "Medium"
//                           ? "bg-yellow-100 text-yellow-700"
//                           : "bg-red-100 text-red-700"
//                       }`}
//                     >
//                       {r.difficulty}
//                     </span>
//                   </div>

//                   {/* Nutrition Info */}
//                   <div
//                     className="flex justify-between text-xs text-gray-500 pt-2
//                     border-t border-amber-100"
//                   >
//                     <span>🔥 {r.calories} cal</span>
//                     <span>💪 {r.protein} protein</span>
//                   </div>

//                   {/* Hover Overlay */}
//                   <div
//                     className={`absolute inset-0 bg-amber-600/90 text-white p-4
//                     flex flex-col items-center justify-center transition-all duration-300
//                     ${
//                       hoveredCard === i
//                         ? "opacity-100"
//                         : "opacity-0 pointer-events-none"
//                     }`}
//                   >
//                     <h4 className="font-bold text-lg mb-2">{r.name}</h4>
//                     <p className="text-xs text-center mb-3">{r.desc}</p>
//                     <button
//                       className="px-4 py-2 bg-white text-amber-600 rounded-full
//                       text-sm font-medium hover:bg-amber-50 transition-colors"
//                     >
//                       View Recipe
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {/* No Results */}
//             {filtered.length === 0 && (
//               <div className="col-span-full text-center py-12">
//                 <div className="inline-block p-6 bg-amber-50 rounded-2xl">
//                   <Utensils className="h-12 w-12 text-amber-300 mx-auto mb-4" />
//                   <p className="text-gray-600 mb-2">
//                     No recipes match your filters
//                   </p>
//                   <p className="text-sm text-gray-400">
//                     Try adjusting your search criteria
//                   </p>
//                   <button
//                     onClick={() => {
//                       setTime("Any");
//                       setDiff("Any");
//                       setMeal("Any");
//                       setSearchTerm("");
//                     }}
//                     className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-full
//                       text-sm hover:bg-amber-700 transition-colors"
//                   >
//                     Clear all filters
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default RecipeGenerator;
