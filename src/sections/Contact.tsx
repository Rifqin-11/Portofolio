import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

import ContactExperience from "../components/ContactExperience";

import toast from "react-hot-toast";

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Show loading state

    try {
      if (formRef.current) {
        await emailjs.sendForm(
          import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
          formRef.current,
          import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
        );

        // Reset form and stop loading
        setForm({ name: "", email: "", message: "" });
        toast.success("Message sent successfully!");
      } else {
        throw new Error("Form reference is null.");
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="editorial-section contact-section">
      <div className="contact-section__inner">
        <div className="editorial-section__header contact-section__header">
          <p className="editorial-kicker">Contact</p>
          <h2>Have a project in mind?</h2>
          <p>Tell me what you are building and I will get back to you.</p>
        </div>
        <div className="contact-layout">
          <div className="contact-form-card">
            <div className="contact-form-card__intro">
              <span>Start a conversation</span>
              <p>I usually reply within a couple of days.</p>
            </div>
            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="contact-form-grid">
                <div>
                  <label htmlFor="name">Your name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="What’s your good name?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="What’s your email address?"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can I help you?"
                  rows={5}
                  required
                />
              </div>

              <button
                type="submit"
                className="contact-submit"
                disabled={loading}
                aria-busy={loading}
              >
                <span className="cta-button group">
                  <span className="bg-circle" />
                  <span className="text">
                    {loading ? "Sending..." : "Send me"}
                  </span>
                  <span className="arrow-wrapper">
                    <img src="/images/arrow-down.svg" alt="" aria-hidden="true" />
                  </span>
                </span>
              </button>
            </form>
          </div>
          <div className="contact-side">
            <div className="contact-side__top">
              <span>Available for select projects</span>
              <span className="contact-side__status">● Online</span>
            </div>
            <div className="contact-side__card">
              <ContactExperience />
            </div>
            <p className="contact-side__note">
              Let’s make something clear, useful, and worth remembering.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
