import React, { useState, useRef, useEffect, lazy, Suspense } from "react";

const AgreementsList = lazy(() => import('./AgreementsList'));
const BodgettMenu = lazy(() => import("../../../components/BodgettMenu"));

const menuComponents = [
  { label: "Listar convênios", component: <Suspense fallback={<div>Carregando...</div>}><AgreementsList /></Suspense> },
];


let Agreements = () => {
    return (
        <div>
            <BodgettMenu components={menuComponents} />
        </div>
    )
}

export default Agreements; 