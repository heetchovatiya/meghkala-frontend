// // app/our-story/page.tsx

// import Image from 'next/image';
// import { Metadata } from 'next';

// // Add metadata for better SEO
// export const metadata: Metadata = {
//   title: 'Our Story | Meghkala',
//   description: 'The heart and soul of Meghkala. Discover the story behind our handcrafted artistry.',
// };

// export default function OurStoryPage() {
//   return (
//     <div className="bg-primary-bg">
//       <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
        
//         {/* Page Header */}
//         <div className="text-center mb-16 max-w-3xl mx-auto">
//           <h1 className="text-4xl md:text-6xl font-serif font-bold text-heading-color leading-tight">
//             Art Born of Clouds
//           </h1>
//           <p className="mt-4 text-lg md:text-xl text-text-color">
//             The heart and soul of Meghkala.
//           </p>
//         </div>

//         {/* Main Content - Two Column Layout */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          
//           {/* Image Column */}
//           <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg transform md:hover:scale-105 transition-transform duration-500 ease-in-out">
//             <Image 
//               src="/our-story.png" // The image you placed in the /public folder
//               alt="The hands of the Meghkala artist, carefully handcrafting a piece in a peaceful, sunlit studio."
//               fill
//               className="object-cover"
//               sizes="(max-width: 768px) 100vw, 50vw"
//             />
//           </div>

//           {/* Text Column */}
//           <div className="space-y-6 text-text-color leading-relaxed text-base md:text-lg">
//             <h2 className="text-3xl font-serif text-heading-color">
//               The Weaver of Dreams
//             </h2>
//             <p>
//               Meghkala began not in a boardroom, but in the quiet moments of observation. It started with a single crochet hook and a desire to create more than just objects, but feelings. Our founder, Heet Mehta, saw stories in the everyday—in the soft grey of a monsoon cloud, the blush of a rose at dawn, the resilient green of a new leaf.
//             </p>
//             <p>
//               This brand is a testament to that vision: a place where the gentle pace of handcrafted artistry stands in quiet contrast to a world of mass production. It is a celebration of taking time, of honoring the process, and of the unique beauty that can only come from a human touch.
//             </p>
//           </div>

//           {/* This section will reverse the column order for visual interest */}
//           <div className="space-y-6 text-text-color leading-relaxed text-base md:text-lg md:col-start-2">
//              <h2 className="text-3xl font-serif text-heading-color">
//               Perfectly Imperfect
//             </h2>
//             <p>
//               In a world that chases perfection, we find beauty in authenticity. Every Meghkala creation is inherently unique, carrying the subtle signature of the hands that made it. A slight variation in a stitch, a unique curve in a form—these are not flaws. They are the echoes of a creative journey, a guarantee that the piece you hold is the only one of its kind in the world.
//             </p>
//           </div>

//           <div className="space-y-6 text-text-color leading-relaxed text-base md:text-lg">
//              <h2 className="text-3xl font-serif text-heading-color">
//               An Invitation
//             </h2>
//             <p>
//               When you bring a Meghkala piece into your life, you are welcoming more than an item. You are embracing a philosophy. You are choosing to value the story, the time, and the care woven into its very fabric.
//             </p>
//             <p>
//               Thank you for being here, for appreciating the art of the handmade, and for being a part of our story. We hope our creations bring a piece of the serene, artful cloudscape into your home.
//             </p>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// app/our-story/page.tsx

// import Image from 'next/image';
// import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Our Story | Meghkala',
//   description: 'The heart and soul of Meghkala. Discover the story behind our handcrafted artistry.',
// };

// export default function OurStoryPage() {
//   return (
//     <div className="bg-primary-bg overflow-x-hidden"> {/* Prevent horizontal scroll */}
//       <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
        
//         {/* Page Header */}
//         <div className="text-center mb-16 max-w-3xl mx-auto">
//           <h1 className="text-4xl md:text-6xl font-serif font-bold text-heading-color leading-tight">
//             Art Born of Clouds
//           </h1>
//           <p className="mt-4 text-lg md:text-xl text-text-color">
//             The heart and soul of Meghkala.
//           </p>
//         </div>

//         {/* --- Main Content: Organic Overlap Layout --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-12 items-center">
          
//           {/* --- Image Composition Column --- */}
// <div className="absolute top-0 left-0 w-full h-full rounded-full 
//                bg-gradient-to-br from-accent/20 to-secondary-bg/20 
//                blur-2xl opacity-70">            {/* 1. The Organic "Blob" Background Shape/Image */}
//               <Image 
//     src="/our-story-background.png"
//     alt="A soft paper texture representing the Meghkala brand"
//     fill
//     className="object-cover"
//     // This is a more complex clip-path that creates a jagged, torn-paper look.
//     style={{ clipPath: 'polygon(0% 15%, 15% 0%, 100% 0, 85% 100%, 0 100%)' }}
//   />
// </div>

// {/* 2. The Main "Artist" Image on top (slightly adjusted rotation) */}
// <div className="relative z-10 w-64 h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden shadow-2xl ...">

//   <Image 
//     src="/our-story.png"
//     alt="The Meghkala artist at work"
//     fill
//     className="object-cover"
//   />
// </div>

//           {/* --- Text Column --- */}
//           <div className="prose prose-lg prose-p:text-text-color prose-h2:text-heading-color prose-h2:font-serif max-w-none">
//             <h2>The Weaver of Dreams</h2>
//             <p>
//               Meghkala began not in a boardroom, but in the quiet moments of observation. It started with a single crochet hook and a desire to create more than just objects, but feelings. Our founder, Heet Mehta, saw stories in the everyday...
//             </p>
//             <p>
//               This brand is a testament to that vision: a place where the gentle pace of handcrafted artistry stands in quiet contrast to a world of mass production...
//             </p>
//           </div>
//         </div>

//         {/* --- Second Section --- */}
//         {/* We can create another layout for the rest of the text */}
//         <div className="max-w-3xl mx-auto mt-20 md:mt-28 prose prose-lg prose-p:text-text-color prose-h2:text-heading-color prose-h2:font-serif">
//           <h2>Perfectly Imperfect</h2>
//           <p>
//             In a world that chases perfection, we find beauty in authenticity. Every Meghkala creation is inherently unique, carrying the subtle signature of the hands that made it...
//           </p>
          
//           <h2>An Invitation</h2>
//           <p>
//             When you bring a Meghkala piece into your life, you are welcoming more than an item. You are embracing a philosophy...
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }



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