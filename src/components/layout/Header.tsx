import { useState } from "react";
import { NavLink } from "react-router";
import ConnectWalletButton from "web3/ConnectWalletButton";
import ROUTES from "routes/route-names";
import FaucetModal from "components/modals/FaucetModal";

export default function Header() {
  const [isFaucetModalOpen, setIsFaucetModalOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl px-6 mx-auto">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <NavLink
              to="/"
              className="text-xl flex items-center gap-1.5 font-bold text-primary"
            >
              <img src="/logo.png" alt="logo" className="w-6 h-6" />
              Signals
            </NavLink>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsFaucetModalOpen(true)}
              className="cursor-pointer hover:text-primary transition-colors"
            >
              Faucet
            </button>
            <NavLink to={ROUTES.HISTORY}>
              History
            </NavLink>
            <ConnectWalletButton />
          </div>
        </div>
      </nav>

      <FaucetModal 
        isOpen={isFaucetModalOpen}
        onClose={() => setIsFaucetModalOpen(false)}
      />
    </header>
  );
}
