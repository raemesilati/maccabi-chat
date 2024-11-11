import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface IUser {
  token: string;
  user: IUserDetails;
}

export interface IUserDetails {
  createdAt: string;
  email: string;
  fullName: string;
  id: string;
}

interface UserContentType {
  userContext: IUser | null;
  loading: boolean;
  updateContext: (user: IUser | null) => void;
}

const UserContext = createContext<UserContentType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

const UserContextProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userContext, setUserContext] = useState<IUser | null>(() => {
    const storedContext = localStorage.getItem("chatToken");
    return storedContext ? JSON.parse(storedContext) : null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(false);
  }, [userContext]);

  const updateContext = (user: IUser | null) => {
    setLoading(true);

    setUserContext(user);

    localStorage.setItem("chatToken", JSON.stringify(user) ?? "");

    if (!user) {
      window.location.href = "./login";
    }
  };

  return (
    <UserContext.Provider value={{ userContext, loading, updateContext }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContentType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used withib a UserProvder");
  }

  return context;
};

export default UserContextProvider;
