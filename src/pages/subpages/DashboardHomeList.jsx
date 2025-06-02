import React from "react";
import styles from '../../styles/pages-styles/DashboardHomeStyle.module.css';

const summary = {
  doctors: 3,
  patients: 120,
  appointments: 42,
  revenue: 12500.50,
};

const appointmentsByDay = [
  { day: 'Seg', value: 8 },
  { day: 'Ter', value: 10 },
  { day: 'Qua', value: 7 },
  { day: 'Qui', value: 9 },
  { day: 'Sex', value: 8 },
];

const revenueByMonth = [
  { month: 'Jan', value: 8000 },
  { month: 'Fev', value: 9500 },
  { month: 'Mar', value: 11000 },
  { month: 'Abr', value: 12500 },
  { month: 'Mai', value: 14000 },
];

const notices = [
  { id: 1, text: 'Novo procedimento disponível: Vacina da gripe.' },
  { id: 2, text: 'Atualização: Sistema ficará indisponível dia 25/06 das 22h às 23h.' },
];

const DashboardHomeList = () => (
  <>
    <h2 style={{ marginBottom: 24 }}>Bem-vindo(a) ao Dashboard!</h2>
    <div className={styles.dashboardGrid}>
      {/* Cards de resumo */}
      <div className={styles.card}>
        <div className={styles.cardTitle}>Médicos</div>
        <div className={styles.cardValue}>{summary.doctors}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Pacientes</div>
        <div className={styles.cardValue}>{summary.patients}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Compromissos</div>
        <div className={styles.cardValue}>{summary.appointments}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Faturamento</div>
        <div className={styles.cardValue}>R$ {summary.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
      </div>
    </div>

    {/* Gráficos simples (barras) */}
    <div className={styles.chartsSection}>
      <div className={styles.chartCard}>
        <div className={styles.chartTitle}>Compromissos por dia</div>
        <div className={styles.barChart}>
          {appointmentsByDay.map((item) => (
            <div key={item.day} className={styles.barItem}>
              <div
                className={styles.bar}
                style={{ height: `${item.value * 12}px`, background: '#3b82f6' }}
                title={item.value}
              ></div>
              <span className={styles.barLabel}>{item.day}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.chartCard}>
        <div className={styles.chartTitle}>Faturamento mensal</div>
        <div className={styles.barChart}>
          {revenueByMonth.map((item) => (
            <div key={item.month} className={styles.barItem}>
              <div
                className={styles.bar}
                style={{ height: `${item.value / 100}px`, background: '#10b981' }}
                title={item.value}
              ></div>
              <span className={styles.barLabel}>{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Avisos */}
    <div className={styles.noticesSection}>
      <div className={styles.noticesTitle}>Avisos</div>
      <ul className={styles.noticesList}>
        {notices.map((notice) => (
          <li key={notice.id} className={styles.noticeItem}>{notice.text}</li>
        ))}
      </ul>
    </div>
  </>
);

export default DashboardHomeList; 