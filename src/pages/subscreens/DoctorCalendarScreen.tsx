import React, { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { type EventContentArg, type EventMountArg, type EventInput, type EventApi } from '@fullcalendar/core';

// Import your CSS module
import styles from './styles/DoctorCalendar.module.css';

// You'll need to define types for your data (Médico, Paciente, Procedimento, etc.)
// These are placeholder types. Adjust them based on your actual API response.
interface Medico {
    id: string;
    nome: string;
    crm: string;
    especialidade: string;
}

interface Paciente {
    id: string;
    nome: string;
    cpf?: string;
}

interface Procedimento {
    id: string;
    nome: string;
    valor: number;
}

// Extend FullCalendar's EventInput to include custom props
interface CustomEventInput extends EventInput {
    extendedProps?: {
        status?: 'available' | 'scheduled' | 'completed';
        medico?: Medico;
        paciente?: Paciente;
        procedimentos?: Procedimento[];
        observacoes?: string;
    };
}

// Placeholder events - these would typically come from an API
const initialEvents: CustomEventInput[] = [
    {
        id: '1',
        title: 'Consulta Dr. João Silva - Disponível',
        start: new Date(new Date().setHours(10, 0, 0)),
        end: new Date(new Date().setHours(10, 30, 0)),
        extendedProps: {
            status: 'available',
            medico: { id: 'doc1', nome: 'Dr. João Silva', crm: 'CRM/SP 12345', especialidade: 'Cardiologia' }
        },
        classNames: [styles.fcEvent, styles.available]
    },
    {
        id: '2',
        title: 'Consulta Agendada - Maria Santos',
        start: new Date(new Date().setHours(11, 0, 0)),
        end: new Date(new Date().setHours(11, 30, 0)),
        extendedProps: {
            status: 'scheduled',
            medico: { id: 'doc1', nome: 'Dr. João Silva', crm: 'CRM/SP 12345', especialidade: 'Cardiologia' },
            paciente: { id: 'pat1', nome: 'Maria Santos', cpf: '123.456.789-00' },
            procedimentos: [{ id: 'proc1', nome: 'Consulta Geral', valor: 150.00 }],
            observacoes: 'Paciente com tosse persistente.'
        },
        classNames: [styles.fcEvent, styles.scheduled]
    },
    {
        id: '3',
        title: 'Consulta Dra. Ana Costa - Disponível',
        start: new Date(new Date().setHours(14, 0, 0)),
        end: new Date(new Date().setHours(14, 30, 0)),
        extendedProps: {
            status: 'available',
            medico: { id: 'doc2', nome: 'Dra. Ana Costa', crm: 'CRM/SP 67890', especialidade: 'Dermatologia' }
        },
        classNames: [styles.fcEvent, styles.available]
    }
];

function renderEventContent(eventInfo: EventContentArg) {
    const status = eventInfo.event.extendedProps.status;
    let icon = '';
    if (status === 'available') {
        icon = '✅';
    } else if (status === 'scheduled') {
        icon = '👨‍⚕️';
    }

    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i> {icon} {eventInfo.event.title}</i>
        </>
    );
}

const DoctorCalendarScreen = () => {
    const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null);
    const [calendarEvents, setCalendarEvents] = useState<CustomEventInput[]>(initialEvents);
    const [showSelectMedicoModal, setShowSelectMedicoModal] = useState(true);

    const [medicos, setMedicos] = useState<Medico[]>([]);
    // const [pacientes, setPacientes] = useState<Paciente[]>([]); // Removed this line

    const [specialtyFilters, setSpecialtyFilters] = useState<Set<string>>(new Set());

    useEffect(() => {
        const dummyMedicos: Medico[] = [
            { id: 'doc1', nome: 'Dr. João Silva', crm: 'CRM/SP 12345', especialidade: 'Cardiologia' },
            { id: 'doc2', nome: 'Dra. Ana Costa', crm: 'CRM/SP 67890', especialidade: 'Dermatologia' },
            { id: 'doc3', nome: 'Dr. Pedro Oliveira', crm: 'CRM/SP 54321', especialidade: 'Pediatria' },
        ];
        setMedicos(dummyMedicos);

        // const dummyPacientes: Paciente[] = [ // Removed this block
        //     { id: 'pat1', nome: 'Maria Santos', cpf: '123.456.789-00' },
        //     { id: 'pat2', nome: 'Carlos Pereira', cpf: '987.654.321-11' },
        // ];
        // setPacientes(dummyPacientes); // Removed this line
    }, []);

    const handleMedicoSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const medicoId = e.target.value;
        const medico = medicos.find(m => m.id === medicoId);
        if (medico) {
            setSelectedMedico(medico);
            // Filter initialEvents to show only events for the selected medico
            const eventsForSelectedMedico = initialEvents.filter(event =>
                event.extendedProps?.medico?.id === medico.id
            );
            setCalendarEvents(eventsForSelectedMedico);
        }
    };

    const toggleSpecialtyFilter = (specialty: string) => {
        setSpecialtyFilters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(specialty)) {
                newSet.delete(specialty);
            } else {
                newSet.add(specialty);
            }
            return newSet;
        });
    };

    // Filter events by selected doctor (if any) and then apply specialty filters
    const filteredAndSpecialtySortedEvents = calendarEvents.map(event => {
        const eventMedicoSpecialty = event.extendedProps?.medico?.especialidade;
        const shouldShow = specialtyFilters.size === 0 || (eventMedicoSpecialty && specialtyFilters.has(eventMedicoSpecialty));
        return {
            ...event,
            display: shouldShow ? 'auto' : 'none',
        } as CustomEventInput;
    });

    const showLiberarHorariosModal = () => alert('Abrir modal Liberar Horários');
    const showHorariosPersonalizadosModal = () => alert('Abrir modal Horários Personalizados');
    const showExcluirHorariosModal = () => alert('Abrir modal Excluir Horários');
    const showAgendarConsultaModal = (event: EventApi) => {
        const dateObject = new Date(event.startStr);

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };

        const formattedDateTime = dateObject.toLocaleString('pt-BR', options);

        alert(`Agendar consulta para: ${formattedDateTime}`);
    };
    const mostrarDetalhesConsulta = (event: EventContentArg['event']) => alert(`Detalhes da consulta para: ${event.title}`);

    const ModalSelectMedico = () => (
        <div className={`${styles.modal} ${showSelectMedicoModal ? styles.dBlock : styles.dNone}`} tabIndex={-1} role="dialog">
            <div className={styles.modalDialog} role="document">
                <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                        <h5 className={styles.modalTitle}>Selecionar Médico</h5>
                    </div>
                    <div className={styles.modalBody}>
                        <div className={styles.formGroup}>
                            <label htmlFor="medicoSelect">Escolha o médico:</label>
                            <select
                                className={styles.formControl}
                                id="medicoSelect"
                                onChange={handleMedicoSelect}
                                value={selectedMedico?.id || ''}
                                required
                            >
                                <option value="" disabled>Selecione um médico</option>
                                {medicos.map(medico => (
                                    <option key={medico.id} value={medico.id}>
                                        {medico.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.btnPrimary} onClick={() => {
                            if (selectedMedico) setShowSelectMedicoModal(false);
                            else alert('Por favor, selecione um médico primeiro.');
                        }}>
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles.bodyBackground}>
            <ModalSelectMedico />

            <div className={styles.containerFluid}>
                <div className={styles.specialtyFilters}>
                    {[...new Set(medicos.map(m => m.especialidade))].map(specialty => (
                        <button
                            key={specialty}
                            className={`${styles.specialtyFilter} ${specialtyFilters.has(specialty) ? styles.active : ''}`}
                            onClick={() => toggleSpecialtyFilter(specialty)}
                        >
                            {specialty}
                        </button>
                    ))}
                </div>

                {selectedMedico && (
                    <div className={styles.medicoInfo}>
                        <h4>Agenda do Dr(a). <span id="medicoNome">{selectedMedico.nome}</span></h4>
                        <p className={styles.mb0}>CRM: <span id="medicoCRM">{selectedMedico.crm}</span> | Especialidade: <span id="medicoEspecialidade">{selectedMedico.especialidade}</span></p>
                    </div>
                )}

                <div className={styles.controls}>
                    <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={showLiberarHorariosModal}>
                        <i className="fas fa-plus"></i> Liberar Horários
                    </button>
                    <button className={`${styles.btn} ${styles.btnSuccess}`} onClick={showHorariosPersonalizadosModal}>
                        <i className="fas fa-clock"></i> Horários Personalizados
                    </button>
                    <button className={`${styles.btn} ${styles.btnInfo}`} onClick={() => setShowSelectMedicoModal(true)}>
                        <i className="fas fa-user-md"></i> Trocar Médico
                    </button>
                    <button className={`${styles.btn} ${styles.btnDanger}`} onClick={showExcluirHorariosModal}>
                        <i className="fas fa-trash"></i> Excluir Horários
                    </button>
                </div>

                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView='dayGridMonth'
                    weekends={false}
                    events={filteredAndSpecialtySortedEvents}
                    eventContent={renderEventContent}
                    locale='pt-br'
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        // right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    slotMinTime='07:00:00'
                    slotMaxTime='19:00:00'
                    slotDuration='00:30:00'
                    eventClick={function(info) {
                        if (info.event.extendedProps.status === 'available') {
                            showAgendarConsultaModal(info.event);
                        } else if (info.event.extendedProps.status === 'scheduled') {
                            mostrarDetalhesConsulta(info.event);
                        }
                    }}
                    eventDidMount={(info: EventMountArg) => {
                        if (info.event.extendedProps.status === 'scheduled' &&
                            info.event.extendedProps.paciente &&
                            info.event.extendedProps.procedimentos) {
                            const pacienteNome = info.event.extendedProps.paciente.nome;
                            const procedimentosText = info.event.extendedProps.procedimentos.map((p: Procedimento) => p.nome).join(', ');
                            info.el.setAttribute('title', `Paciente: ${pacienteNome}\nProcedimentos: ${procedimentosText}`);
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default DoctorCalendarScreen;