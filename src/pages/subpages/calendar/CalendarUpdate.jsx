import React, { useState, useEffect } from 'react';
import styles from '../../../styles/pages-styles/CalendarStyle.module.css';

const doctors = [
  { id: '1', name: 'Dr. João Silva', specialty: 'Cardiologia', crm: 'CRM/SP 12345' },
  { id: '2', name: 'Dra. Ana Costa', specialty: 'Dermatologia', crm: 'CRM/SP 67890' },
  { id: '3', name: 'Dr. Pedro Oliveira', specialty: 'Pediatria', crm: 'CRM/SP 54321' }
];

const procedures = [
  { id: '1', name: 'Consulta' },
  { id: '2', name: 'Retorno' },
  { id: '3', name: 'Exame' },
  { id: '4', name: 'Vacina' },
];

const defaultEvent = {
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  color: '#3b82f6',
  procedure: '',
  value: '',
};

// Simulação de compromissos existentes
const initialEvents = [
  {
    id: '1001',
    doctorId: '1',
    title: 'Consulta inicial',
    date: '2024-06-20',
    startTime: '09:00',
    endTime: '09:30',
    color: '#3b82f6',
    procedure: 'Consulta',
    value: '200',
  },
  {
    id: '1002',
    doctorId: '2',
    title: 'Retorno',
    date: '2024-06-21',
    startTime: '10:00',
    endTime: '10:30',
    color: '#10b981',
    procedure: 'Retorno',
    value: '100',
  },
];

const CalendarUpdate = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorModal, setShowDoctorModal] = useState(true);
  const [events, setEvents] = useState(initialEvents);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [eventData, setEventData] = useState(defaultEvent);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const savedDoctorId = sessionStorage.getItem('selectedDoctorId');
    if (savedDoctorId) {
      const doctor = doctors.find(d => d.id === savedDoctorId);
      if (doctor) {
        setSelectedDoctor(doctor);
        setShowDoctorModal(false);
      }
    }
  }, []);

  // Quando seleciona um compromisso, preenche o formulário
  useEffect(() => {
    if (selectedEventId) {
      const ev = events.find(e => e.id === selectedEventId);
      if (ev) setEventData(ev);
    } else {
      setEventData(defaultEvent);
    }
  }, [selectedEventId, events]);

  const handleDoctorSelect = (e) => {
    const doctorId = e.target.value;
    const doctor = doctors.find(d => d.id === doctorId);
    setSelectedDoctor(doctor);
    sessionStorage.setItem('selectedDoctorId', doctorId);
    setSelectedEventId('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateEvent = (e) => {
    e.preventDefault();
    setError('');
    if (!eventData.title || !eventData.date || !eventData.startTime || !eventData.endTime || !eventData.procedure || !eventData.value) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    if (!selectedDoctor) {
      setError('Selecione um médico.');
      return;
    }
    if (eventData.startTime >= eventData.endTime) {
      setError('A hora de início deve ser antes da hora de fim.');
      return;
    }
    setEvents(prev => prev.map(ev => ev.id === selectedEventId ? { ...eventData, doctorId: selectedDoctor.id, id: selectedEventId } : ev));
    setError('');
  };

  const handleDeleteEvent = () => {
    if (!selectedEventId) return;
    setShowDeleteModal(true);
  };

  const confirmDeleteEvent = () => {
    setEvents(prev => prev.filter(ev => ev.id !== selectedEventId));
    setSelectedEventId('');
    setEventData(defaultEvent);
    setError('');
    setShowDeleteModal(false);
  };

  const cancelDeleteEvent = () => {
    setShowDeleteModal(false);
  };

  // Filtra compromissos do médico selecionado
  const doctorEvents = selectedDoctor ? events.filter(ev => ev.doctorId === selectedDoctor.id) : [];

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
              {doctors.map(doctor => (
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
            <h1 className={styles.doctorTitle}>Editar Compromisso de {selectedDoctor.name}</h1>
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
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Selecione um compromisso</label>
              <select
                value={selectedEventId}
                onChange={e => setSelectedEventId(e.target.value)}
                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
              >
                <option value="">Selecione</option>
                {doctorEvents.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} - {ev.date} ({ev.startTime}-{ev.endTime})
                  </option>
                ))}
              </select>
            </div>
            {selectedEventId && (
              <form onSubmit={handleUpdateEvent}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Título *</label>
                  <input
                    type="text"
                    name="title"
                    value={eventData.title}
                    onChange={handleChange}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>Data *</label>
                    <input
                      type="date"
                      name="date"
                      value={eventData.date}
                      onChange={handleChange}
                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>Início *</label>
                    <input
                      type="time"
                      name="startTime"
                      value={eventData.startTime}
                      onChange={handleChange}
                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>Fim *</label>
                    <input
                      type="time"
                      name="endTime"
                      value={eventData.endTime}
                      onChange={handleChange}
                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                      required
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
                  <div style={{ flex: 2 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>Procedimento *</label>
                    <select
                      name="procedure"
                      value={eventData.procedure}
                      onChange={handleChange}
                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                      required
                    >
                      <option value="">Selecione um procedimento</option>
                      {procedures.map(proc => (
                        <option key={proc.id} value={proc.name}>{proc.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>Valor (R$) *</label>
                    <input
                      type="number"
                      name="value"
                      value={eventData.value}
                      onChange={handleChange}
                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Cor</label>
                  <input
                    type="color"
                    name="color"
                    value={eventData.color}
                    onChange={handleChange}
                    style={{ width: 40, height: 40, border: 'none', background: 'none', cursor: 'pointer' }}
                  />
                </div>
                {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="submit" className={styles.confirmButton} style={{ width: '100%' }}>
                    Atualizar Compromisso
                  </button>
                  <button type="button" onClick={handleDeleteEvent} style={{ width: '100%', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 500, cursor: 'pointer' }}>
                    Excluir
                  </button>
                </div>
              </form>
            )}
            {showDeleteModal && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <h3 className={styles.modalTitle}>Confirmação</h3>
                  <p>Você realmente quer excluir este compromisso?</p>
                  <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    <button onClick={confirmDeleteEvent} className={styles.confirmButton} style={{ background: '#ef4444', color: '#fff', width: '100%' }}>
                      Sim, excluir
                    </button>
                    <button onClick={cancelDeleteEvent} className={styles.changeDoctorButton} style={{ width: '100%' }}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {doctorEvents.length > 0 && (
            <div className={styles.calendarWrapper} style={{ marginTop: 32 }}>
              <h2 style={{ marginBottom: 16, color: '#1e293b', fontSize: '1.2rem' }}>Compromissos do Médico</h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {doctorEvents.map(ev => (
                  <li key={ev.id} style={{
                    background: ev.color,
                    color: '#fff',
                    borderRadius: 6,
                    padding: '12px 16px',
                    marginBottom: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}>
                    <strong>{ev.title}</strong><br />
                    {ev.date} | {ev.startTime} - {ev.endTime}<br />
                    Procedimento: {ev.procedure} <br />
                    Valor: R$ {Number(ev.value).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarUpdate;
