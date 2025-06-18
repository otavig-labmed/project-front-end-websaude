import React, { useState, useEffect, lazy, Suspense, memo, useMemo, useCallback } from 'react';
import styles from '../../../styles/pages-styles/CalendarStyle.module.css';
import LoadingSpinner from '../../../components/load/LoadingSpinner';

const FullCalendar = lazy(() => import('@fullcalendar/react'));

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

// Memoized doctors data
const doctors = [
  { id: '1', name: 'Dr. João Silva', specialty: 'Cardiologia', crm: 'CRM/SP 12345' },
  { id: '2', name: 'Dra. Ana Costa', specialty: 'Dermatologia', crm: 'CRM/SP 67890' },
  { id: '3', name: 'Dr. Pedro Oliveira', specialty: 'Pediatria', crm: 'CRM/SP 54321' }
];

const events = [
  { id: '1', title: 'Disponível', start: '2025-11-15T10:00:00', end: '2023-11-15T10:30:00', color: '#10b981', doctorId: '1' },
  { id: '2', title: 'Consulta - Maria Santos', start: '2025-11-15T11:00:00', end: '2023-11-15T11:30:00', color: '#3b82f6', doctorId: '1' },
  { id: '3', title: 'Disponível', start: '2025-11-15T14:00:00', end: '2023-11-15T14:30:00', color: '#10b981', doctorId: '2' }
];

const DoctorCalendar = memo(() => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorModal, setShowDoctorModal] = useState(true);

  const filteredEvents = useMemo(() => 
    events.filter((e) => e.doctorId === selectedDoctor?.id),
    [selectedDoctor?.id]
  );

  useEffect(() => {
    const savedDoctorId = sessionStorage.getItem('selectedDoctorId');
    if (savedDoctorId) {
      const doctor = doctors.find(d => d.id === savedDoctorId);
      setSelectedDoctor(doctor);
      setShowDoctorModal(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      document.title = `Agenda ${selectedDoctor.name} - WebSaúde`;
    } else {
      document.title = 'Agenda Médica - WebSaúde';
    }
  }, [selectedDoctor]);

  const handleDoctorSelect = useCallback((e) => {
    const doctorId = e.target.value;
    const doctor = doctors.find(d => d.id === doctorId);
    setSelectedDoctor(doctor);
    sessionStorage.setItem('selectedDoctorId', doctorId);
  }, []);

  const handleEventClick = useCallback((info) => {
    alert(`Clicou no evento: ${info.event.title}`);
  }, []);

  const handleConfirmDoctor = useCallback(() => {
    if (selectedDoctor) {
      setShowDoctorModal(false);
    }
  }, [selectedDoctor]);

  const handleChangeDoctor = useCallback(() => {
    setShowDoctorModal(true);
  }, []);

  return (
    <div className={styles.doctorCalendarContainer}>
      {showDoctorModal && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className={styles.modalContent}>
            <h3 id="modal-title" className={styles.modalTitle}>Selecionar Médico</h3>
            <select
              className={styles.doctorSelect}
              onChange={handleDoctorSelect}
              value={selectedDoctor?.id || ''}
              aria-label="Selecione um médico"
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
              onClick={handleConfirmDoctor}
              disabled={!selectedDoctor}
              aria-describedby={!selectedDoctor ? "doctor-required" : undefined}
            >
              Confirmar
            </button>
            {!selectedDoctor && (
              <div id="doctor-required" className="sr-only">
                É necessário selecionar um médico para continuar
              </div>
            )}
          </div>
        </div>
      )}

      {selectedDoctor && (
        <div className={styles.scrollContainer}>
          <div className={styles.calendarHeader}>
            <h1 className={styles.doctorTitle}>
              Agenda {selectedDoctor.name}
            </h1>
            <br />
            {/*<p className={styles.doctorInfo}>
              CRM: {selectedDoctor.crm} | Especialidade: {selectedDoctor.specialty}
            </p> */}
            <button
              className={styles.changeDoctorButton}
              onClick={handleChangeDoctor}
              aria-label={`Trocar de médico. Atual: ${selectedDoctor.name}`}
            >
              Trocar de Médico
            </button>
          </div>

          <div className={styles.calendarWrapper}>
            <Suspense fallback={<LoadingSpinner text="Carregando calendário..." />}>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView="dayGridMonth"
                events={filteredEvents}
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
                height="auto"
                aspectRatio={1.35}
                dayMaxEvents={true}
                moreLinkClick="popover"
                eventDisplay="block"
                eventTimeFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  meridiem: false,
                  hour12: false
                }}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
});

DoctorCalendar.displayName = 'DoctorCalendar';

export default DoctorCalendar;
