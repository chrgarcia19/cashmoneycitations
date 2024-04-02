"use client"

import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

const MyAnimationComponent: React.FC = () => {
  const animationContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animationContainer.current) {
      const anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        // Adjust the path to your animation file
        path: '/animations/booksAnimation.json',
      });

      // Optional: Clean up animation on component unmount
      return () => anim.destroy();
    }
  }, []); // The empty array ensures this effect runs only once after the initial render

  return <div ref={animationContainer} />;
};

export default MyAnimationComponent;
