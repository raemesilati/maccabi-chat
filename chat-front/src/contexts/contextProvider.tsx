import React from "react";

/**
 * List of context providers for the app
 */
import { ScreenBehaviorsProvider } from "./screenManagementContext";
import UserContextProvider from "./userContext";

const contextProviders: any[] = [UserContextProvider, ScreenBehaviorsProvider];

interface ContextProviderProps {
  children: React.ReactNode;
}

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  return contextProviders.reduceRight((memo, ContextProvider) => {
    return <ContextProvider>{memo}</ContextProvider>;
  }, children);
};

export default ContextProvider;
