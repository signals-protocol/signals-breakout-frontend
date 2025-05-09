import { Outlet } from "react-router";
import Header from "components/layout/Header";

export default function LayoutDefault() {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 relative">
        <Outlet />
      </main>
    </>
  );
}
