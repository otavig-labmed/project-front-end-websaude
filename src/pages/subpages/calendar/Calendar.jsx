import React, { lazy, Suspense } from "react";
import { useAuth } from '../../../contexts/AuthContext.jsx'; 
import BodgettMenu from '../../../components/BodgettMenu';

const CalendarCreate = lazy(() => import("./CalendarCreate"));
const CalendarList = lazy(() => import("./CalendarList"));
const CalendarUpdate = lazy(() => import("./CalendarUpdate"));

const Calendar = () => {
  const { permissions } = useAuth();

  const calendarSubMenuItems = [
    {
      label: "Listar Compromissos",
      name: "calendar-list", 
      component: <Suspense fallback={<div>Carregando...</div>}><CalendarList /></Suspense>,
      permission: "agenda_visualizar"
    },
    {
      label: "Criar Compromisso",
      name: "calendar-create",
      component: <Suspense fallback={<div>Carregando...</div>}><CalendarCreate /></Suspense>,
      permission: "agenda_criar" 
    },
    {
      label: "Atualizar Compromisso",
      name: "calendar-update",
      component: <Suspense fallback={<div>Carregando...</div>}><CalendarUpdate /></Suspense>,
      permission: "agenda_editar" 
    }
  ];

  const filteredMenuComponents = calendarSubMenuItems.filter(item => {
    if (item.permission) {
      return permissions.includes(item.permission);
    }
    return true; 
  });

  if (filteredMenuComponents.length === 0) {
      return (
          <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
              Você não tem permissão para visualizar nenhuma seção do Calendário.
          </div>
      );
  }

  return (
    <div>
      <BodgettMenu components={filteredMenuComponents} />
    </div>
  );
};

export default Calendar;