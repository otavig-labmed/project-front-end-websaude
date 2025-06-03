import React, { useState, useEffect, lazy, Suspense } from 'react';
import styles from '../../../styles/pages-styles/CalendarStyle.module.css';

// Lazy load do FullCalendar
const FullCalendar = lazy(() => import('@fullcalendar/react'));
// Importação normal dos plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

const DoctorCalendar = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorModal, setShowDoctorModal] = useState(true);

  // Dados dos médicos
  const doctors = [
    { id: '1', name: 'Dr. João Silva', specialty: 'Cardiologia', crm: 'CRM/SP 12345' },
    { id: '2', name: 'Dra. Ana Costa', specialty: 'Dermatologia', crm: 'CRM/SP 67890' },
    { id: '3', name: 'Dr. Pedro Oliveira', specialty: 'Pediatria', crm: 'CRM/SP 54321' }
  ];

  // Carregar o médico selecionado do sessionStorage
  useEffect(() => {
    const savedDoctorId = sessionStorage.getItem('selectedDoctorId');
    if (savedDoctorId) {
      const doctor = doctors.find(d => d.id === savedDoctorId);
      setSelectedDoctor(doctor);
      setShowDoctorModal(false); // Fechar modal após selecionar médico
    }
  }, []);

  // Dados dos eventos
  const events = [
    { id: '1', title: 'Disponível', start: '2025-11-15T10:00:00', end: '2023-11-15T10:30:00', color: '#10b981', doctorId: '1' },
    { id: '2', title: 'Consulta - Maria Santos', start: '2025-11-15T11:00:00', end: '2023-11-15T11:30:00', color: '#3b82f6', doctorId: '1' },
    { id: '3', title: 'Disponível', start: '2025-11-15T14:00:00', end: '2023-11-15T14:30:00', color: '#10b981', doctorId: '2' }
  ];

  // Atualizar o médico selecionado e salvar no sessionStorage
  const handleDoctorSelect = (e) => {
    const doctorId = e.target.value;
    const doctor = doctors.find(d => d.id === doctorId);
    setSelectedDoctor(doctor);
    sessionStorage.setItem('selectedDoctorId', doctorId);
  };

  // Evento de clique no calendário
  const handleEventClick = (info) => {
    alert(`Clicou no evento: ${info.event.title}`);
  };

  return (
    <div className={styles.doctorCalendarContainer}>
      {showDoctorModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Selecionar Médico</h3>
            <select
              className={styles.doctorSelect}
              onChange={handleDoctorSelect}
              value={selectedDoctor?.id || ''}
            >
              <option value="">Selecione um médico</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </select>
            <button
              className={styles.confirmButton}
              onClick={() => selectedDoctor && setShowDoctorModal(false)}
              disabled={!selectedDoctor}
            >
              Confirmar
            </button>
          </div>
        </div>
      )}

      {selectedDoctor && (
        <div className={styles.scrollContainer}>
          <div className={styles.calendarHeader}>
            <h1 className={styles.doctorTitle}>Agenda do {selectedDoctor.name}</h1>
            <p className={styles.doctorInfo}>
              CRM: {selectedDoctor.crm} | Especialidade: {selectedDoctor.specialty}
            </p>
            <button
              className={styles.changeDoctorButton}
              onClick={() => setShowDoctorModal(true)}
            >
              Trocar Médico
            </button>
          </div>

          <div className={styles.calendarWrapper}>
            <Suspense fallback={<div>Carregando calendário...</div>}>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView="dayGridMonth"
                events={events.filter((e) => e.doctorId === selectedDoctor.id)}
                eventClick={handleEventClick}
                locale="pt-br"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                buttonText={{
                  today: 'Hoje',
                  month: 'Mês',
                  week: 'Semana',
                  day: 'Dia',
                }}
                views={{
                  dayGridMonth: { buttonText: 'Mês' },
                  timeGridWeek: { buttonText: 'Semana' },
                  timeGridDay: { buttonText: 'Dia' },
                }}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorCalendar;
