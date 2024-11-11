import { QueryClient, QueryClientProvider } from "react-query";
import ContextProvider from "./contexts/contextProvider";
import LayoutPage from "./pages/Layout/Layout";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ContextProvider>
        <LayoutPage />
      </ContextProvider>
    </QueryClientProvider>
  );
}

export default App;
