'use client';

import { motion } from "framer-motion";
import { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fadeUp, staggerContainer } from "@/utils/motionVariants";
import emailjs from "emailjs-com";


const contactCards = [
  {
    label: "Email",
    value: "zabedfolio@gmail.com",
    icon: FaEnvelope,
    href: "mailto:zabedfolio@gmail.com"
  },
  {
    label: "Phone",
    value: "+880 1979 333880",
    icon: FaPhoneAlt,
    href: "tel:+8801979333880"
  },
  {
    label: "WhatsApp",
    value: "+880 1979 333880",
    icon: FaWhatsapp,
    href: "https://wa.me/8801979333880"
  }
];

const initialState = {
  name: "",
  email: "",
  phone: "",
  message: ""
};

export default function Contact() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
  event.preventDefault();
  setLoading(true);

  const templateParams = {
    name: form.name,
    email: form.email,
    phone: form.phone,
    message: form.message,
  };

  try {
    await emailjs.send(
      "service_t1jbkqn",     
      "template_xhala38",     
      templateParams,
      "aPfInZVkZDN3gQXkT"       
    );

    toast.success("Message sent successfully!", {
      className: "toast-theme",
      bodyClassName: "text-sm",
    });

    setForm(initialState);
  } catch (error) {
    console.error("EmailJS Error:", error);
    toast.error("Failed to send message. Try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div id="contact" className="section-shell py-24 sm:py-32">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer} className="grid gap-10 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-2">
          <motion.p variants={fadeUp} className="section-label">
            05 — Let&apos;s Talk
          </motion.p>
          <motion.h2 variants={fadeUp} className="section-title">
            Let&apos;s Build Something Exceptional.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg leading-8 text-white/58">
            If you need a portfolio, product landing page, or a high-end frontend presence that feels deliberately crafted, I&apos;m ready to help.
          </motion.p>

          <motion.div variants={fadeUp} className="space-y-4">
            {contactCards.map(({ label, value, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="glass-panel hover-glow flex items-center gap-4 rounded-2xl p-4 cursor-pointer">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#ff4d00]/20 bg-[#ff4d00]/10 text-[#ff8c00]">
                    <Icon />
                  </div>

                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/30">
                      {label}
                    </div>
                    <div className="mt-1 text-white/75">{value}</div>
                  </div>
                </div>
              </a>
            ))}
          </motion.div>

          <motion.a
            variants={fadeUp}
            href="#"
            className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm text-white/80"
          >
            Book a 45-min Call
          </motion.a>
        </div>

        <motion.div variants={fadeUp} className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="glass-panel rounded-[2rem] p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 sm:col-span-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/35">Name</span>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 text-white transition focus:border-[#ff4d00] focus:shadow-[0_0_0_1px_rgba(255,77,0,0.2),0_0_24px_rgba(255,77,0,0.12)]"
                />
              </label>
              <label className="space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/35">Email</span>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 text-white transition focus:border-[#ff4d00] focus:shadow-[0_0_0_1px_rgba(255,77,0,0.2),0_0_24px_rgba(255,77,0,0.12)]"
                />
              </label>
              <label className="space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/35">Phone</span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 text-white transition focus:border-[#ff4d00] focus:shadow-[0_0_0_1px_rgba(255,77,0,0.2),0_0_24px_rgba(255,77,0,0.12)]"
                />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/35">Message</span>
                <textarea
                  required
                  rows={6}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 text-white transition focus:border-[#ff4d00] focus:shadow-[0_0_0_1px_rgba(255,77,0,0.2),0_0_24px_rgba(255,77,0,0.12)]"
                />
              </label>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="mt-6 rounded-full bg-[#ff4d00] px-7 py-4 text-sm font-medium text-white shadow-accent-glow disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>

      <ToastContainer position="bottom-right" theme="dark" toastClassName="toast-theme" />
    </div>
  );
}
