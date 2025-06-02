import React, { lazy, Suspense } from "react";
import styles from '../../styles/pages-styles/DashboardHomeStyle.module.css';

const DashboardHomeList = lazy(() => import("./DashboardHomeList"));

const DashboardHome = () => (
  <div className={styles.dashboardHomeContainer}>
    <Suspense fallback={<div>Carregando dashboard...</div>}>
      <DashboardHomeList />
    </Suspense>
  </div>
);

export default DashboardHome;