import React, { lazy, Suspense } from "react";
import styles from '../../../styles/pages-styles/DashboardHomeStyle.module.css';

const DashboardHomeList = lazy(() => import("./DashboardHomeList"));
const BodgettMenu = lazy(() => import("../../../components/BodgettMenu"));

const DashboardHome = () => (
  <div className={styles.dashboardHomeContainer}>
    <Suspense fallback={<div>Carregando dashboard...</div>}>
      <BodgettMenu components={[]}/>
      <DashboardHomeList />
    </Suspense>
  </div>
);

export default DashboardHome;