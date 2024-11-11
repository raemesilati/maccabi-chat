import React, { createContext, useCallback, useEffect, useState } from "react";

type ScreenContextType = {
  isDesktopView: boolean;
  setIsDesktopView: Function;
};
export const ScreenBehaviorsContext = createContext<ScreenContextType>({
  isDesktopView: true,
  setIsDesktopView: () => {},
});

const getSize = () => {
  return {
    height: globalThis.innerHeight,
    width: globalThis.innerWidth,
  };
};

const useWindowSizeListener = () => {
  const [windowSize, setWindowSize] = useState(getSize());
  const element = globalThis.document ? window : null;

  const handleResize = useCallback(() => {
    setWindowSize(getSize());
  }, [setWindowSize]);

  useEffect(() => {
    if (!element) {
      return;
    }

    element.addEventListener("resize", handleResize);
    return () => {
      element.removeEventListener("resize", handleResize);
    };
  }, [handleResize, element]);

  return windowSize;
};

interface ScreenBehaviorsProviderProps {
  children: React.ReactNode;
}

export const ScreenBehaviorsProvider: React.FC<
  ScreenBehaviorsProviderProps
> = ({ children }) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(true);
  const windowSize = useWindowSizeListener();

  useEffect(() => {
    setIsDesktopView(windowSize.width > 992);
  }, [windowSize]);

  return (
    <ScreenBehaviorsContext.Provider
      value={{ isDesktopView, setIsDesktopView }}
    >
      {children}
    </ScreenBehaviorsContext.Provider>
  );
};
