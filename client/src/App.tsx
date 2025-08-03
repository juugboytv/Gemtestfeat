import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GeminusGame from "./components/GeminusGame";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GeminusGame />
    </QueryClientProvider>
  );
}

export default App;
