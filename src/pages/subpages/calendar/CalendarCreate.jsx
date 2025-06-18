import React, { useState, useEffect } from 'react';
import { 
  Form, 
  FormSection, 
  FormField, 
  FormGrid, 
  Modal, 
} from "../../../components";
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

const CalendarCreate = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorModal, setShowDoctorModal] = useState(true);
  const [eventData, setEventData] = useState(defaultEvent);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

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

  const handleDoctorSelect = (e) => {
    const doctorId = e.target.value;
    const doctor = doctors.find(d => d.id === doctorId);
    setSelectedDoctor(doctor);
    sessionStorage.setItem('selectedDoctorId', doctorId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateEvent = (e) => {
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
    const newEvent = {
      ...eventData,
      doctorId: selectedDoctor.id,
      id: Date.now().toString(),
    };
    setEvents(prev => [...prev, newEvent]);
    setEventData(defaultEvent);
  };

  const doctorOptions = doctors.map(doctor => ({
    value: doctor.id,
    label: `${doctor.name} - ${doctor.specialty}`
  }));

  const procedureOptions = procedures.map(proc => ({
    value: proc.name,
    label: proc.name
  }));

  return (
    <div className={styles.doctorCalendarContainer}>
      <Modal
        isOpen={showDoctorModal}
        onClose={() => selectedDoctor && setShowDoctorModal(false)}
        title="Selecionar Médico"
        size="small"
        closeOnOverlayClick={false}
      >
        <FormField
          label="Médico"
          type="select"
          id="doctorSelect"
          name="doctorSelect"
          value={selectedDoctor?.id || ''}
          onChange={handleDoctorSelect}
          options={doctorOptions}
          placeholder="Selecione um médico"
          required
        />
        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <button 
            className={styles.confirmButton}
            onClick={() => selectedDoctor && setShowDoctorModal(false)}
            disabled={!selectedDoctor}
          >
            Confirmar
          </button>
        </div>
      </Modal>

      {selectedDoctor && (
        <div className={styles.scrollContainer}>
          <div className={styles.calendarHeader}>
            <h1 className={styles.doctorTitle}>Criar Compromisso - {selectedDoctor.name}</h1>
            <br />
            <button
              className={styles.changeDoctorButton}
              onClick={() => setShowDoctorModal(true)}
            >
              Trocar de Médico
            </button>
          </div>

          <div className={styles.calendarWrapper}>
            <Form onSubmit={handleCreateEvent}>
              <FormSection title="Detalhes do Compromisso">
                <FormField
                  label="Título"
                  type="text"
                  id="title"
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  placeholder="Ex: Ultrassom"
                  required
                />

                <FormGrid columns={3}>
                  <FormField
                    label="Data"
                    type="date"
                    id="date"
                    name="date"
                    value={eventData.date}
                    onChange={handleChange}
                    required
                  />
                  <FormField
                    label="Início"
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={eventData.startTime}
                    onChange={handleChange}
                    required
                  />
                  <FormField
                    label="Fim"
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={eventData.endTime}
                    onChange={handleChange}
                    required
                  />
                </FormGrid>

                <FormGrid columns={2}>
                  <FormField
                    label="Procedimento"
                    type="select"
                    id="procedure"
                    name="procedure"
                    value={eventData.procedure}
                    onChange={handleChange}
                    options={procedureOptions}
                    placeholder="Selecione um procedimento"
                    required
                  />
                  <FormField
                    label="Valor (R$)"
                    type="number"
                    id="value"
                    name="value"
                    value={eventData.value}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </FormGrid>

                {error && (
                  <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
                )}
              </FormSection>
            </Form>
          </div>

          {events.length > 0 && (
            <div className={styles.calendarWrapper} style={{ marginTop: 32 }}>
              <h2 style={{ marginBottom: 16, color: '#1e293b', fontSize: '1.2rem' }}>Compromissos Criados</h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {events.map(ev => (
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

export default CalendarCreate; 