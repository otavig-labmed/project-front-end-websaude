import React, { lazy, Suspense } from "react";

const BodgettMenu = lazy(() => import("../../../components/BodgettMenu"));
const PatientCreate = lazy(() => import("./PatientCreate"));

const menuComponents = [
  { label: "Criar Paciente", component: <Suspense fallback={<div>Carregando...</div>}><PatientCreate /></Suspense> },

];

let Patient = () => {
    return (
        <div>
            <BodgettMenu components={menuComponents} />
        </div>
    )
}

export default Patient; 
