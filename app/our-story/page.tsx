// app/our-story/page.tsx



import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story | Meghkala',
  description: 'The heart and soul of Meghkala. Discover the story behind our handcrafted artistry.',
};

export default function OurStoryPage() {
  return (
    <div className="bg-primary-bg overflow-x-hidden"> {/* Prevent horizontal scroll */}
      <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
        
        {/* Page Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-heading-color leading-tight">
            Art Born of Clouds
          </h1>
          <p className="mt-4 text-lg md:text-xl text-text-color">
            The heart and soul of Meghkala.
          </p>
        </div>

        {/* --- Main Content: Organic Overlap Layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-12 items-center">
          
          {/* --- Image Composition Column --- */}
          <div className="relative h-96 md:h-[500px] flex items-center justify-center">
            {/* 1. The Organic "Blob" Background Shape/Image */}
            <div className="absolute top-0 left-0 w-80 h-80 md:w-96 md:h-96">
              <Image 
                src="/our-story-background.png" // Your texture/atmosphere image
                alt="A soft texture representing the Meghkala brand"
                fill
                className="object-cover"
                // This 'clip-path' creates the organic blob shape. You can generate new shapes at clippycss.com
                style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 100%, 0% 100%)' }}
              />
            </div>

            {/* 2. The Main "Artist" Image on top */}
            <div className="relative z-10 w-64 h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden shadow-2xl
                           transform rotate-[-3deg] hover:rotate-[-1deg] hover:scale-105
                           transition-transform duration-500 ease-in-out">
              <Image 
                src="/our-story.png" // Your primary "hands at work" photo
                alt="The Meghkala artist at work"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* --- Text Column --- */}
          <div className="prose prose-lg prose-p:text-text-color prose-h2:text-heading-color prose-h2:font-serif max-w-none">
            <h2>The Weaver of Dreams</h2>
            <p>
              Meghkala began not in a boardroom, but in the quiet moments of observation. It started with a single crochet hook and a desire to create more than just objects, but feelings. Our founder, Megha Chovatiya, saw stories in the everyday...
            </p>
            <p>
              This brand is a testament to that vision: a place where the gentle pace of handcrafted artistry stands in quiet contrast to a world of mass production...
            </p>
          </div>
        </div>

        {/* --- Second Section --- */}
        {/* We can create another layout for the rest of the text */}
        <div className="max-w-3xl mx-auto mt-20 md:mt-28 prose prose-lg prose-p:text-text-color prose-h2:text-heading-color prose-h2:font-serif">
          <h2>Perfectly Imperfect</h2>
          <p>
            In a world that chases perfection, we find beauty in authenticity. Every Meghkala creation is inherently unique, carrying the subtle signature of the hands that made it...
          </p>
          
          <h2>An Invitation</h2>
          <p>
            When you bring a Meghkala piece into your life, you are welcoming more than an item. You are embracing a philosophy...
          </p>
        </div>
      </div>
    </div>
  );
}