import { InstagramIcon } from '@/components/ui/icons';
import { siteConfig } from '@/config/site.config';

const PLACEHOLDER_POSTS = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  hue: 30 + i * 6,
  lightness: 82 - i * 2,
}));

export function InstagramFeed() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center gap-2 mb-10">
          <InstagramIcon width={20} height={20} className="text-brand-gold" />
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-brand-stone">
            Follow Us
          </p>
          <a
            href={`${siteConfig.instagramUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-serif text-brand-black hover:text-brand-gold transition-colors"
          >
            @{siteConfig.instagram}
          </a>
          <p className="text-sm text-brand-stone">
            Tag us in your photos for a chance to be featured
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {PLACEHOLDER_POSTS.map(({ id, hue, lightness }) => (
            <a
              key={id}
              href={`${siteConfig.instagramUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-sm"
            >
              <div
                className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                style={{ background: `hsl(${hue}, 30%, ${lightness}%)` }}
              />
              <div className="absolute inset-0 bg-brand-gold/0 group-hover:bg-brand-gold/20 transition-colors duration-300 flex items-center justify-center">
                <InstagramIcon
                  width={20}
                  height={20}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
