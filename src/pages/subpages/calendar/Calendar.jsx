import React, { lazy, Suspense } from "react";

const CalendarCreate = lazy(() => import("./CalendarCreate"));
const CalendarList = lazy(() => import("./CalendarList"));
const CalendarUpdate = lazy(() => import("./CalendarUpdate"));
const BodgettMenu = lazy(() => import("../../../components/BodgettMenu"));

const menuComponents = [
  { label: "Listar compromissos", component: <Suspense fallback={<div>Carregando...</div>}><CalendarList /></Suspense> },
  { label: "Criar compromisso", component: <Suspense fallback={<div>Carregando...</div>}><CalendarCreate /></Suspense> },
  { label: "Atualizar compromisso", component: <Suspense fallback={<div>Carregando...</div>}><CalendarUpdate /></Suspense> }
];

const Calendar = () => (
  <div>
    <BodgettMenu components={menuComponents} />
  </div>
);

export default Calendar; 