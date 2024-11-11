import { useContext } from "react";
import { ScreenBehaviorsContext } from "../contexts/screenManagementContext";

const useScreenBehaviors = () => {
  const { isDesktopView } = useContext(ScreenBehaviorsContext);

  return {
    isDesktopView,
  };
};

export default useScreenBehaviors;
