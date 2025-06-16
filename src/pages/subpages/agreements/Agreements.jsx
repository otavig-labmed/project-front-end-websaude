import React, { lazy, Suspense } from "react";

const AgreementsList = lazy(() => import('./AgreementsList'));
const AgreementsCreate = lazy(() => import('./AgreementsCreate'))
const BodgettMenu = lazy(() => import("../../../components/BodgettMenu"));

const menuComponents = [
  { label: "Listar Convênios", component: <Suspense fallback={<div>Carregando...</div>}><AgreementsList /></Suspense> },
  { label: "Cadastrar Convênio", component: <Suspense fallback={<div>Carregando...</div>}><AgreementsCreate /></Suspense> },
];


let Agreements = () => {
    return (
        <div>
            <BodgettMenu components={menuComponents} />
        </div>
    )
}

export default Agreements; 