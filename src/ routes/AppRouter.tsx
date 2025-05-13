import { Route, Routes, BrowserRouter } from "react-router";
import HomePage from "pages/home";
import HistoryPage from "pages/history";
import LayoutDefault from " routes/layouts/LayoutDefault";
import LayoutMinimal from " routes/layouts/LayoutMinimal";
import ROUTES from "./route-names";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutDefault />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.HISTORY} element={<HistoryPage />} />
        </Route>

        <Route element={<LayoutMinimal />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
