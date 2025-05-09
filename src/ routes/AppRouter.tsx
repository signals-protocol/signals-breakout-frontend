import { Route, Routes, BrowserRouter } from "react-router";
import Home from "pages/home";
import LayoutDefault from " routes/layouts/LayoutDefault";
import LayoutMinimal from " routes/layouts/LayoutMinimal";
import ROUTES from "./route-names";
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
      <Route element={<LayoutDefault />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        </Route>
        <Route element={<LayoutMinimal />}>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
