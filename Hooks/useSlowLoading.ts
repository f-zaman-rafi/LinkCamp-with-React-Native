import { useEffect, useState } from 'react';

const useSlowLoading = (isLoading: boolean, delayMs = 10000) => {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsSlow(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsSlow(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs, isLoading]);

  return isSlow;
};

export default useSlowLoading;
