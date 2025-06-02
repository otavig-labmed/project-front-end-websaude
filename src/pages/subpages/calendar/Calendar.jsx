import React, { lazy, Suspense } from "react";
import BodgettMenu from "../../../components/BodgettMenu";

const CalendarCreate = lazy(() => import("./CalendarCreate"));
const CalendarList = lazy(() => import("./CalendarList"));

const menuComponents = [
  { label: "Listar compromissos", component: <Suspense fallback={<div>Carregando...</div>}><CalendarList /></Suspense> },
  { label: "Criar compromisso", component: <Suspense fallback={<div>Carregando...</div>}><CalendarCreate /></Suspense> }
];

const Calendar = () => (
  <div>
    <BodgettMenu components={menuComponents} />
  </div>
);

export default Calendar; 