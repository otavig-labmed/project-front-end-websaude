import React, { lazy, Suspense } from "react";

const DashboardHomeList = lazy(() => import("./DashboardHomeList"));
const BodgettMenu = lazy(() => import("../../../components/BodgettMenu"));

const menuComponents = [
  { label: "Dashboard", component: <Suspense fallback={<div>Carregando dashboard...</div>}><DashboardHomeList /></Suspense>},
];

const DashboardHome = () => (
  <div>
      <BodgettMenu components={menuComponents}/>
  </div>
);

export default DashboardHome;