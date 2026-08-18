import Link from 'next/link';
import { MessageCircle, Mail, Phone } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/icons';
import { siteConfig } from '@/config/site.config';
import { footerLinks } from '@/config/navigation.config';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-black text-brand-pearl mt-auto">
      {/* Top strip */}
      <div className="border-b border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-serif text-2xl text-brand-gold">{siteConfig.name}</p>
            <p className="text-sm text-brand-pearl/60 text-center max-w-md">
              {siteConfig.tagline}
            </p>
            <div className="flex items-center gap-4">
              <a
                href={`${siteConfig.instagramUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-pearl/60 hover:text-brand-gold transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon width={18} height={18} />
              </a>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-pearl/60 hover:text-brand-gold transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-brand-pearl/60 hover:text-brand-gold transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([groupLabel, links]) => (
              <div key={groupLabel}>
                <h3 className="text-xs font-medium uppercase tracking-widest text-brand-gold mb-4">
                  {groupLabel}
                </h3>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-brand-pearl/60 hover:text-brand-pearl transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact */}
            <div>
              <h3 className="text-xs font-medium uppercase tracking-widest text-brand-gold mb-4">
                Contact
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <a href={`tel:${siteConfig.phone}`} className="text-sm text-brand-pearl/60 hover:text-brand-pearl transition-colors flex items-center gap-2">
                    <Phone size={12} /> {siteConfig.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="text-sm text-brand-pearl/60 hover:text-brand-pearl transition-colors flex items-center gap-2">
                    <Mail size={12} /> {siteConfig.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${siteConfig.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-pearl/60 hover:text-brand-pearl transition-colors flex items-center gap-2"
                  >
                    <MessageCircle size={12} /> WhatsApp Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-brand-pearl/40">
          <p>© {year} {siteConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-brand-pearl/70 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-brand-pearl/70 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
