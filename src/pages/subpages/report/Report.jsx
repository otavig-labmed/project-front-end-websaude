import React, { lazy, Suspense } from "react";

const ReportList = lazy(() => import('./ReportList'));
const ReportCreate = lazy(() => import('./ReportCreate'));
const BodgettMenu = lazy(() => import("../../../components/BodgettMenu"));

const menuComponents = [
  { label: "Gerar Relatório", component: <Suspense fallback={<div>Carregando...</div>}><ReportList /></Suspense> },
//   { label: "Cadastrar um Relatório", component: <Suspense fallback={<div>Carregando...</div>}><ReportCreate /></Suspense> },
];
 
const Report = () => {
	return (
		<div>
            <BodgettMenu components={menuComponents} />
		</div>
	)
}

export default Report;