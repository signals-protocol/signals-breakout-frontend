import SolanaWalletProvider from "./web3/provider";
import AppRouter from "./ routes/AppRouter";

function App() {
  return (
    <SolanaWalletProvider>
      <AppRouter />
    </SolanaWalletProvider>
  );
}

export default App;
