import React, { lazy, Suspense } from "react";
import BodgettMenu from "../../../components/BodgettMenu";

const CalendarCreate = lazy(() => import("./CalendarCreate"));
const CalendarList = lazy(() => import("./CalendarList"));
const CalendarUpdate = lazy(() => import("./CalendarUpdate"));

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