import { Route } from "react-router-dom";
import { lazy } from "react";
import withSuspense from "./AutoSuspense";
import RentalManage from "../pages/MainRoutes/RentalsManage/RentalManage";
import UserPanelLayout from "../layout/UserPanelLayout";
import CoHostPanel from "../pages/MainRoutes/CoHostPanelPage/CoHostPanel";

const HomePage = withSuspense(
  lazy(() => import("../pages/MainRoutes/HomePage/HomePage"))
);

const ExplorePage = withSuspense(
  lazy(() => import("../pages/MainRoutes/ExplorePage/ExplorePage"))
);

const HouseDetailPage = withSuspense(
  lazy(() => import("../pages/MainRoutes/HouseDetailPage/HouseDetailPage"))
);

const UserPanel = withSuspense(
  lazy(() => import("../pages/MainRoutes/UserPanelPage/UserPanel"))
);

// Separate routes for user panel and main layout
const UserPanelRoutes = (
  <Route path="/user-panel" element={<UserPanel />}>
    <Route index element={<UserPanel />} />
    <Route path="profile" element={<UserPanel />} />
    <Route path="reservations" element={<UserPanel />} />
    <Route path="transactions" element={<UserPanel />} />
    <Route path="notifications" element={<UserPanel />} />
    <Route path="settings" element={<UserPanel />} />
  </Route>
);

const CoHostPanelRoutes = (
  <Route path="/cohost-panel" element={<CoHostPanel />}>
    <Route index element={<CoHostPanel />} />
    <Route path="profile" element={<CoHostPanel />} />
    <Route path="reservations" element={<CoHostPanel />} />
    <Route path="transactions" element={<CoHostPanel />} />
    <Route path="notifications" element={<CoHostPanel />} />
    <Route path="settings" element={<CoHostPanel />} />
  </Route>
);

const MainRoutes = [
  // main pages with layout
  <Route key="home" path="/" element={<HomePage />} />,
  <Route key="home" path="/rentals-managment" element={<RentalManage />} />,
  <Route path="/Explore" element={<ExplorePage />} />,
  <Route path="/House/:id?" element={<HouseDetailPage />} />,
  <Route path="/user-panel" element={<UserPanel />}></Route>,
    <Route path="/cohost-panel" element={<UserPanel />}></Route>,
];

export { MainRoutes, UserPanelRoutes , CoHostPanelRoutes };
