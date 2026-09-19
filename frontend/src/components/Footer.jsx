import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin, ShieldCheck, Truck, Clock, BadgePercent } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t dark:border-slate-800 mt-16">
      {/* Trust strip */}
      <div className="border-b dark:border-slate-800 bg-brand-50/60 dark:bg-slate-800/40">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-brand-600 shrink-0" size={22} />
            <div>
              <p className="text-sm font-semibold text-ink dark:text-slate-100">100% Genuine</p>
              <p className="text-xs text-ink/50 dark:text-slate-400">Licensed pharmacy</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="text-brand-600 shrink-0" size={22} />
            <div>
              <p className="text-sm font-semibold text-ink dark:text-slate-100">Fast Delivery</p>
              <p className="text-xs text-ink/50 dark:text-slate-400">Doorstep in 2-3 days</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BadgePercent className="text-brand-600 shrink-0" size={22} />
            <div>
              <p className="text-sm font-semibold text-ink dark:text-slate-100">Best Prices</p>
              <p className="text-xs text-ink/50 dark:text-slate-400">Discounts on 500+ items</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="text-brand-600 shrink-0" size={22} />
            <div>
              <p className="text-sm font-semibold text-ink dark:text-slate-100">24x7 Support</p>
              <p className="text-xs text-ink/50 dark:text-slate-400">Always here to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 text-brand-700 font-display font-bold text-xl mb-3">
            <span className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center">+</span>
            MedKart
          </Link>
          <p className="text-sm text-ink/60 dark:text-slate-400 leading-relaxed">
            Your trusted online pharmacy for genuine medicines, healthcare essentials
            and everyday wellness — delivered right to your door.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-300 flex items-center justify-center hover:bg-brand-600 hover:text-white transition">
              <Facebook size={16} />
            </a>
            <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-300 flex items-center justify-center hover:bg-brand-600 hover:text-white transition">
              <Instagram size={16} />
            </a>
            <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-300 flex items-center justify-center hover:bg-brand-600 hover:text-white transition">
              <Twitter size={16} />
            </a>
            <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-300 flex items-center justify-center hover:bg-brand-600 hover:text-white transition">
              <Linkedin size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold text-ink dark:text-slate-100 mb-3 text-sm">Quick Links</h4>
          <ul className="space-y-2 text-sm text-ink/60 dark:text-slate-400">
            <li><Link to="/" className="hover:text-brand-600">Medicines</Link></li>
            <li><Link to="/cart" className="hover:text-brand-600">Cart</Link></li>
            <li><Link to="/orders" className="hover:text-brand-600">My Orders</Link></li>
            <li><Link to="/register" className="hover:text-brand-600">Create Account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-ink dark:text-slate-100 mb-3 text-sm">Categories</h4>
          <ul className="space-y-2 text-sm text-ink/60 dark:text-slate-400">
            <li>Painkillers</li>
            <li>Vitamins & Supplements</li>
            <li>Diabetes Care</li>
            <li>Skincare</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-ink dark:text-slate-100 mb-3 text-sm">Contact Us</h4>
          <ul className="space-y-3 text-sm text-ink/60 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="text-brand-600 shrink-0 mt-0.5" />
              <span>Lucknow, Uttar Pradesh, India</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-brand-600 shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-brand-600 shrink-0" />
              <span>support@medkart.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink/50 dark:text-slate-400">
          <p>© {year} MedKart. All rights reserved.</p>
          <p>Built with the MERN stack — for demo & educational purposes only.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
