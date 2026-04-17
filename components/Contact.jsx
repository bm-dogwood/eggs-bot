"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Heart,
  Shield,
  Clock,
  ChevronRight,
  Globe,
  Bot,
  Sparkles,
  Award,
  ChevronUp,
} from "lucide-react";

const ContactFooter = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setFormLoading(false);
      setFormSubmitted(true);
      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
    }, 1500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const faqs = [
    {
      question: "How does the AI health assistant work?",
      answer:
        "Our AI analyzes your symptoms and medical history using advanced algorithms to provide personalized insights and preparation for doctor visits.",
    },
    {
      question: "Is my health data secure?",
      answer:
        "Absolutely. We use bank-level encryption and are fully HIPAA compliant. Your data never leaves our secure servers without your permission.",
    },
    {
      question: "Can I share my summary with my doctor?",
      answer:
        "Yes! You can download or print your summary and share it directly with your healthcare provider during your appointment.",
    },
    {
      question: "What does the premium plan include?",
      answer:
        "Premium includes unlimited AI consultations, detailed health insights, medication tracking, and priority support.",
    },
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "support@Eggs.com",
      link: "mailto:support@Eggs.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (888) 123-4567",
      link: "tel:+18881234567",
    },
    {
      icon: MapPin,
      label: "Office",
      value: "123 Health Ave, NYC 10001",
      link: "https://maps.google.com",
    },
    {
      icon: Clock,
      label: "Support Hours",
      value: "24/7 - Always here for you",
    },
  ];

  const socialLinks = [
    {
      icon: "",
      href: "#",
      label: "Facebook",
      color: "hover:text-amber-600",
    },
    { icon: "", href: "#", label: "Twitter", color: "hover:text-sky-400" },
    {
      icon: "Instagram",
      href: "#",
      label: "Instagram",
      color: "hover:text-pink-600",
    },
    {
      icon: "Linkedin",
      href: "#",
      label: "LinkedIn",
      color: "hover:text-amber-700",
    },
    {
      icon: "Youtube",
      href: "#",
      label: "YouTube",
      color: "hover:text-red-600",
    },
  ];

  const quickLinks = [
    { label: "About Us", href: "#", icon: Heart },
    { label: "Privacy Policy", href: "#", icon: Shield },
    { label: "Terms of Service", href: "#", icon: Award },
    { label: "Blog", href: "#", icon: MessageSquare },
    { label: "Careers", href: "#", icon: Sparkles },
  ];

  return (
    <footer
      className="relative bg-gradient-to-b from-slate-950 to-slate-950 text-white overflow-hidden"
      id="contact"
    >
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent"></div>
      </div>

      {/* Medical pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5L55 30L30 55L5 30L30 5Z' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      ></div>

      {/* Contact Section */}
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-0.5 bg-amber-300 mr-3"></div>
            <span className="text-amber-500 font-semibold tracking-wider text-sm">
              GET IN TOUCH
            </span>
            <div className="w-12 h-0.5 bg-amber-300 ml-3"></div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-amber-300  bg-clip-text text-transparent">
              We're Here to Help
            </span>
          </h2>

          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Sign up for our automated egg subscription to get fresh,
            pasture-raised eggs delivered to your door and taste the difference.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Left Column - Contact Info & FAQ */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="grid grid-cols-2 gap-4">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  className="group bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all hover:scale-105"
                >
                  <item.icon className="w-6 h-6 text-amber-400 mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-sm text-white/60 mb-1">{item.label}</p>
                  <p className="font-medium text-white/90 text-sm">
                    {item.value}
                  </p>
                </a>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Frequently Asked Questions
              </h3>

              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border-b border-white/10 last:border-0 pb-3 last:pb-0"
                  >
                    <button
                      onClick={() =>
                        setExpandedFaq(expandedFaq === index ? null : index)
                      }
                      className="w-full text-left flex items-center justify-between gap-2 py-2"
                    >
                      <span className="text-sm font-medium text-white/90">
                        {faq.question}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-amber-400 transition-transform ${
                          expandedFaq === index ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {expandedFaq === index && (
                      <p className="text-sm text-white/60 mt-2 pb-2 animate-fadeIn">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all hover:scale-110 ${social.color}`}
                  aria-label={social.label}
                ></a>
              ))}
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
            <h3 className="text-xl font-semibold mb-2">Send us a message</h3>
            <p className="text-white/60 text-sm mb-6">
              We'll get back to you within 24 hours
            </p>

            {formSubmitted ? (
              <div className="bg-amber-500/20 border border-amber-500/50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-6 h-6 text-amber-400" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Message Sent!</h4>
                <p className="text-white/70 text-sm">
                  Thank you for reaching out. Our team will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                    placeholder="Tell us about your health journey..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {formLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-xs text-white/40 text-center">
                  By submitting, you agree to our Privacy Policy and Terms of
                  Service.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">Eggs.Bot</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-span-1">
              <h4 className="font-semibold mb-4 text-white/90">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm group"
                    >
                      <link.icon className="w-4 h-4 group-hover:text-amber-400" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="col-span-1">
              <h4 className="font-semibold mb-4 text-white/90">Resources</h4>
              <ul className="space-y-2">
                {[
                  "Health Library",
                  "Blog",
                  "Community",
                  "Support Center",
                  "API Docs",
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-white/60 hover:text-white transition-colors text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="col-span-1">
              <h4 className="font-semibold mb-4 text-white/90">Stay Updated</h4>
              <p className="text-white/60 text-sm mb-3">
                Get health tips and updates
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:border-amber-500"
                />
                <button className="px-3 py-2 bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10 text-sm text-white/40">
            <div className="flex items-center gap-4">
              <span>© 2024 Eggs.bot. All rights reserved.</span>
              <span className="w-1 h-1 bg-white/20 rounded-full"></span>
              <span>HIPAA Compliant</span>
              <span className="w-1 h-1 bg-white/20 rounded-full"></span>
              <span>FDA Registered</span>
            </div>

            <div className="flex items-center gap-4">
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-white/60">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>

              <button
                onClick={scrollToTop}
                className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                aria-label="Scroll to top"
              >
                <ChevronUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ContactFooter;
