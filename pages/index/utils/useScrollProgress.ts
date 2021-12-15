import { useEffect } from 'react';

export const scrollProgress = {
  save: () => {
    if (window.scrollY !== undefined) {
      sessionStorage.setItem(`${window.location.pathname}ScrollHeight`, window.scrollY.toString());
    }
  },
  load: () => {
    // 应当等到下一事件循环再执行，否则无效
    const scrollHeight = sessionStorage.getItem(`${window.location.pathname}ScrollHeight`);
    if (scrollHeight !== null) {
      setTimeout(() => {
        window.scrollTo(0, Number(scrollHeight));
      }, 0);
    }
  },
};

const useScrollProgress = () => {
  useEffect(() => {
    scrollProgress.load();
  }, []);
  return scrollProgress;
};

export default useScrollProgress;
