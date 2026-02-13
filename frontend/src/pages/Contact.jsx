import React, { useState, useEffect } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    if (submitMessage) {
      const timer = setTimeout(() => {
        setSubmitMessage("");
      }, 3000); 

      return () => clearTimeout(timer);
    }
  }, [submitMessage]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("https://formspree.io/f/xjknawwe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitMessage(
          "✅ Message sent successfully! We'll get back to you soon.",
        );
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitMessage("❌ Something went wrong. Please try again.");
      }
    } catch (error) {
      setSubmitMessage("❌ Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 px-4 sm:px-6 pt-24 pb-16 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto">
  
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#C97C5D] to-[#D4A574] bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-gray-600">
            Have questions or want to place a custom order? Send us a message!
          </p>
        </div>


        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-amber-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Send us a Message
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
       
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C97C5D] focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
           
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C97C5D] focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Your Message
              </label>
              <textarea
                name="message"
                placeholder="Tell us about your inquiry..."
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C97C5D] focus:border-transparent transition-all duration-300 resize-none"
              />
            </div>

     
            {submitMessage && (
              <div
                className={`p-4 rounded-xl ${submitMessage.includes("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
              >
                {submitMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#C97C5D] to-[#D4A574] hover:shadow-lg hover:scale-[1.02]"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Sending...
                </span>
              ) : (
                "Send Message"
              )}
            </button>
          </form>

        
        </div>
      </div>
    </div>
  );
};

export default Contact;