import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFilter, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import styles from '../../../styles/pages-styles/ReportStyle.module.css';

const ReportList = () => {
    const [selectedReport, setSelectedReport] = useState('');
    const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
    });

    const reportTypes = [
        { id: 'consultas', name: 'Relatório de Consultas' },
        { id: 'procedimentos', name: 'Relatório de Procedimentos' },
        { id: 'faturamento', name: 'Relatório de Faturamento' },
        { id: 'pacientes', name: 'Relatório de Pacientes' },
        { id: 'convenios', name: 'Relatório de Convênios' }
    ];

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGenerateReport = () => {
        console.log('Gerando relatório:', {
            type: selectedReport,
            dateRange
        });
    };

    return (
        <div className={styles.scrollContainer}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.cardTitle}>Relatórios</h1>
                </div>

                <div className={styles.reportContainer}>
                    <div className={styles.reportControls}>
                        <div className={styles.formGroup}>
                            <label htmlFor="reportType">Tipo de Relatório*</label>
                            <select
                                id="reportType"
                                value={selectedReport}
                                onChange={(e) => setSelectedReport(e.target.value)}
                                className={styles.formControl}
                                required
                            >
                                <option value="">Selecione um relatório</option>
                                {reportTypes.map(report => (
                                    <option key={report.id} value={report.id}>{report.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.dateRangeContainer}>
                            <div className={styles.formGroup}>
                                <label htmlFor="startDate">
                                    <FontAwesomeIcon icon={faCalendarAlt} className={styles.icon} />
                                    Data Inicial
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="start"
                                    value={dateRange.start}
                                    onChange={handleDateChange}
                                    className={styles.formControl}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="endDate">
                                    <FontAwesomeIcon icon={faCalendarAlt} className={styles.icon} />
                                    Data Final
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="end"
                                    value={dateRange.end}
                                    onChange={handleDateChange}
                                    className={styles.formControl}
                                />
                            </div>
                        </div>

                        <div className={styles.filterSection}>
                            <button className={styles.filterButton}>
                                <FontAwesomeIcon icon={faFilter} className={styles.icon} />
                                Mais Filtros
                            </button>
                        </div>

                        <div className={styles.generateButtonContainer}>
                            <button 
                                onClick={handleGenerateReport}
                                className={styles.submitButton}
                                disabled={!selectedReport}
                            >
                                <FontAwesomeIcon icon={faDownload} className={styles.icon} />
                                Gerar Relatório
                            </button>
                        </div>
                    </div>

                    {selectedReport && (
                        <div className={styles.reportPreview}>
                            <div className={styles.previewHeader}>
                                <h3>Pré-visualização</h3>
                                <span className={styles.badge}>Últimos 30 dias</span>
                            </div>
                            <div className={styles.previewContent}>
                                <p>Selecione um tipo de relatório e ajuste os filtros para visualizar os dados.</p>
                    
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportList;