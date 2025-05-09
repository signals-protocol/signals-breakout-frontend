import { NavLink } from "react-router";
import ConnectWalletButton from "web3/ConnectWalletButton";

export default function Header() {
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
          

          <ConnectWalletButton   />
        </div>
      </nav>
    </header>
  );
}
