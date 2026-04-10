import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType(); // Detects 'PUSH' (new link) or 'POP' (back button)

  // 1. Constantly save the user's scroll position for the current page
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(`scroll_pos_${pathname}`, window.scrollY);
    };
    
    // Add listener when they are on the page
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup listener when they leave
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // 2. Decide where to scroll when the route changes
  useEffect(() => {
    if (navType === 'POP') {
      // If they clicked the BACK button, retrieve their old position
      const savedPosition = sessionStorage.getItem(`scroll_pos_${pathname}`);
      
      if (savedPosition) {
        // The setTimeout pushes this to the end of the execution queue,
        // giving your ProductContext time to instantly render the grid first
        setTimeout(() => {
          window.scrollTo({
            top: parseInt(savedPosition, 10),
            left: 0,
            behavior: 'instant' // Prevents weird smooth scrolling
          });
        }, 50); // 50ms delay ensures React paints the DOM before scrolling
      }
    } else {
      // If it's a NEW click (like clicking a product or nav link), go straight to top
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });
      }, 0);
    }
  }, [pathname, navType]);

  return null;
}