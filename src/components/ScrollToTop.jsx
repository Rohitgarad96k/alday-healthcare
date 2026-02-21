import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // The setTimeout(..., 0) pushes the scroll event to the end of the execution queue,
    // ensuring the new page is fully painted in the DOM before scrolling.
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // 'instant' prevents weird scrolling animations on page load
      });
    }, 0);
  }, [pathname]);

  return null;
}