import React, { useState } from 'react';
import { TAJ_VILLA_IMAGES } from '../data/roomsData';
import { Maximize2, X, Sparkles, MapPin } from 'lucide-react';

interface GalleryItem {
  image: string;
  title: string;
  category: string;
  description: string;
}

export const GallerySection: React.FC = () => {
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      image: TAJ_VILLA_IMAGES.exterior,
      title: 'Villa Front Colonnade & Veranda',
      category: 'Exterior & Architecture',
      description:
        'Classical white arched colonnade with round pillars, terracotta brick facade, and lush mango foliage on Sumbal Road, F-10 Islamabad.',
    },
    {
      image: TAJ_VILLA_IMAGES.deluxe,
      title: 'Deluxe Master Bedroom & En-Suite',
      category: 'Guest Accommodations',
      description:
        'Spacious room featuring floor-to-ceiling built-in white wardrobe closet, cultural artwork, and modern en-suite bathroom with vanity.',
    },
    {
      image: TAJ_VILLA_IMAGES.ceiling,
      title: 'Artisan Coffered Ceiling with Recessed Lights',
      category: 'Interior Craftsmanship',
      description:
        'Exquisite decorative false ceiling featuring artisan geometric blue, gold, and terracotta medallions with integrated warm pin spotlights.',
    },
    {
      image: TAJ_VILLA_IMAGES.pineRoof,
      title: 'Terracotta Tiled Roof & Islamabad Pines',
      category: 'Villa Grounds',
      description:
        'Distinctive scalloped clay tile roofing with bay windows, framed by lush Margalla chir pine branches.',
    },
    {
      image: TAJ_VILLA_IMAGES.suite,
      title: 'Executive Suite in Warm Amber Tone',
      category: 'Suite Living',
      description:
        'Inviting warm amber yellow walls, modern high-efficiency ceiling fan, ambient bedside lighting, and supreme guest comfort.',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-8 shadow-xs">
      <div className="max-w-3xl mb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Villa Architecture & Rooms</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Taj Villa Gallery & Atmosphere
        </h2>
        <p className="text-stone-600 text-sm mt-1">
          Explore genuine photography of our property at House #14, Sumbal Rd, F-10 Islamabad.
        </p>
      </div>

      {/* Grid of 5 photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setActiveImage(item)}
            className={`group relative rounded-xl overflow-hidden bg-stone-100 border border-stone-200 cursor-pointer shadow-xs hover:shadow-md transition-all ${
              idx === 0 ? 'sm:col-span-2 lg:col-span-2 aspect-16/9' : 'aspect-4/3'
            }`}
          >
            <img
              src={item.image}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Hover overlay content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-amber-600/90 text-amber-100 backdrop-blur-xs mb-1.5 inline-block">
                {item.category}
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold leading-tight drop-shadow-xs">
                {item.title}
              </h3>
              <p className="text-xs text-stone-200 line-clamp-1 mt-0.5 opacity-90">
                {item.description}
              </p>
            </div>

            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="bg-stone-900 text-white max-w-4xl w-full rounded-2xl overflow-hidden border border-stone-700 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-16/10 bg-black max-h-[70vh] flex items-center justify-center overflow-hidden">
              <img
                src={activeImage.image}
                alt={activeImage.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-4 sm:p-5 bg-stone-900 border-t border-stone-800 flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  {activeImage.category}
                </span>
                <h3 className="font-serif text-lg font-bold mt-0.5">{activeImage.title}</h3>
                <p className="text-xs text-stone-300 mt-1 max-w-2xl">{activeImage.description}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  House #14, F-10
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
