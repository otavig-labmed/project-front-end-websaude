import React, { lazy, Suspense } from "react";

const BodgettMenu = lazy(() => import("../../../components/BodgettMenu"));
const FindingsCreate = lazy(() => import("./FindingsCreate.jsx"))

const menuComponents = [
  { label: "Registrar Problema", component: <Suspense fallback={<div>Carregando...</div>}><FindingsCreate /></Suspense> },

];

let Findings = () => {
    return (
        <div>
            <BodgettMenu components={menuComponents} />
        </div>
    )
}

export default Findings; 
