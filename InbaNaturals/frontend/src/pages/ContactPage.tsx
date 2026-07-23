import { useState, type FormEvent } from 'react';
import { Phone, Mail, MessageCircle, Clock, MapPin, Send } from 'lucide-react';
import LeafDivider from '../components/LeafDivider';

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">

      {/* Page header */}
      <div className="bg-ivory-dark py-14 text-center border-b border-ivory-dark">
        <span className="text-sage text-xs font-medium uppercase tracking-widest">We're Here For You</span>
        <h1 className="font-serif text-5xl text-charcoal mt-2 mb-3">Get in Touch</h1>
        <LeafDivider />
        <p className="text-charcoal-light mt-4 max-w-md mx-auto text-sm leading-relaxed">
          Have a question about our products or your order? We'd love to hear from you. We typically respond within 24 hours.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-3 gap-10">

        {/* Contact info card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-ivory-dark p-7">
            <h2 className="font-serif text-2xl text-charcoal mb-6">Contact Info</h2>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-sage" />
                </div>
                <div>
                  <p className="text-xs text-charcoal-light font-medium uppercase tracking-wider mb-0.5">Phone</p>
                  <p className="text-charcoal text-sm font-medium">+91 00000 00000</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-sage" />
                </div>
                <div>
                  <p className="text-xs text-charcoal-light font-medium uppercase tracking-wider mb-0.5">Email</p>
                  <p className="text-charcoal text-sm font-medium">hello@inbanaturals.com</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-sage" />
                </div>
                <div>
                  <p className="text-xs text-charcoal-light font-medium uppercase tracking-wider mb-0.5">Business Hours</p>
                  <p className="text-charcoal text-sm font-medium">Mon–Sat, 10am–6pm IST</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-sage" />
                </div>
                <div>
                  <p className="text-xs text-charcoal-light font-medium uppercase tracking-wider mb-0.5">Location</p>
                  <p className="text-charcoal text-sm font-medium">Bangalore, Karnataka, India</p>
                </div>
              </li>
            </ul>
          </div>

          {/* WhatsApp card */}
          <div
            className="rounded-2xl p-6 text-white"
            style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
          >
            <MessageCircle size={28} className="mb-3" />
            <h3 className="font-serif text-xl font-semibold mb-2">Chat on WhatsApp</h3>
            <p className="text-white/80 text-sm mb-4 leading-relaxed">
              Get instant replies! Message us directly on WhatsApp for fast support.
            </p>
            <a
              href="https://wa.me/910000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-green-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-green-50 transition-colors"
            >
              <MessageCircle size={16} /> Start Chat
            </a>
          </div>
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-ivory-dark p-8">
            <h2 className="font-serif text-2xl text-charcoal mb-2">Send us a Message</h2>
            <p className="text-charcoal-light text-sm mb-7">
              Fill in the form below and we'll get back to you as soon as possible.
            </p>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={28} className="text-sage" />
                </div>
                <h3 className="font-serif text-2xl text-charcoal mb-2">Message Sent! 🌿</h3>
                <p className="text-charcoal-light text-sm">
                  Thank you for reaching out. We'll reply within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormState({ name: '', email: '', subject: '', message: '' }); }}
                  className="mt-6 text-sage text-sm font-medium hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-charcoal mb-1.5">
                      Full Name <span className="text-terracotta">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl border border-ivory-dark bg-ivory text-charcoal text-sm placeholder-charcoal-light focus:outline-none focus:border-sage transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-charcoal mb-1.5">
                      Email Address <span className="text-terracotta">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-ivory-dark bg-ivory text-charcoal text-sm placeholder-charcoal-light focus:outline-none focus:border-sage transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-medium text-charcoal mb-1.5">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    placeholder="e.g. Order query, Product info…"
                    className="w-full px-4 py-3 rounded-xl border border-ivory-dark bg-ivory text-charcoal text-sm placeholder-charcoal-light focus:outline-none focus:border-sage transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-charcoal mb-1.5">
                    Message <span className="text-terracotta">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={6}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Tell us how we can help you…"
                    className="w-full px-4 py-3 rounded-xl border border-ivory-dark bg-ivory text-charcoal text-sm placeholder-charcoal-light focus:outline-none focus:border-sage transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-sage hover:bg-sage-dark text-white font-semibold py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Send size={18} />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Map placeholder */}
          <div className="mt-6 rounded-2xl overflow-hidden border border-ivory-dark shadow-sm h-48 bg-ivory-dark flex items-center justify-center">
            <div className="text-center text-charcoal-light">
              <MapPin size={32} className="mx-auto mb-2 text-sage" />
              <p className="text-sm font-medium">Map Placeholder</p>
              <p className="text-xs">Bangalore, Karnataka, India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
