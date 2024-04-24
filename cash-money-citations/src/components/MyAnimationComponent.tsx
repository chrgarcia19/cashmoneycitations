'use client'

import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

// Define the props with a more specific type
interface MyAnimationComponentProps {
  imgPath: string; // Specify that imgPath must be a string
}

const MyAnimationComponent = ({ imgPath }: MyAnimationComponentProps) => {
  const animationContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animationContainer.current) {
      const anim = lottie.loadAnimation({
        container: animationContainer.current, // The DOM element to contain the animation
        renderer: 'svg', // Render as SVG
        loop: true, // Loop the animation
        autoplay: true, // Start playing the animation as soon as it's loaded
        path: imgPath, // Use the imgPath string directly
      });

      // Optional: Clean up the animation on component unmount
      return () => anim.destroy();
    }
  }, [imgPath]); // Depend on imgPath to reload the animation if the prop changes

  return <div ref={animationContainer} />;
};

export default MyAnimationComponent;
