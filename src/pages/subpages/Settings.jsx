import React, { useState } from "react";

import styles from "../../styles/pages-styles/SettingsStyle.module.css";

const Settings = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(11) 98765-4321",
    language: "pt-BR",
  });

  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appNotifications: true,
    newsletter: true,
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handlePasswordInfoChange = (e) => {
    const { name, value } = e.target;
    setPasswordInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
    setPasswordError(""); 
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prevNotifications) => ({
      ...prevNotifications,
      [name]: checked,
    }));
  };

  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault();
    console.log("Saving Personal Info:", personalInfo);
    alert("Informações pessoais salvas!");
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    console.log("Saving Notification Preferences:", notifications);
    alert("Preferências de notificação salvas!");
  };

  const openPasswordModal = () => {
    setShowPasswordModal(true);
    setPasswordError("");
    setPasswordInfo({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordError("");
    setPasswordInfo({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  const handlePasswordModalSubmit = (e) => {
    e.preventDefault();
    setPasswordError(""); 

    if (!passwordInfo.currentPassword || !passwordInfo.newPassword || !passwordInfo.confirmNewPassword) {
      setPasswordError("Todos os campos de senha são obrigatórios.");
      return;
    }

    if (passwordInfo.newPassword !== passwordInfo.confirmNewPassword) {
      setPasswordError("A nova senha e a confirmação não coincidem!");
      return;
    }

    if (passwordInfo.newPassword.length < 6) { 
      setPasswordError("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    console.log("Changing Password (via modal):", passwordInfo);
    alert("Senha alterada com sucesso!");

    closePasswordModal();
  };

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.pageContainer}>
        <div className={styles.formContainer}>
          <div className={styles.card}>
            <h1 className={styles.mainCardTitle}>Configurações da Conta</h1>

            <div className={styles.section}> 
              <h2 className={styles.cardTitle}>Informações Pessoais</h2>
              <form onSubmit={handlePersonalInfoSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Nome Completo</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={personalInfo.name}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={personalInfo.email}
                      onChange={handlePersonalInfoChange}
                      disabled 
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="phone">Telefone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="language">Idioma Preferencial</label>
                    <select
                      id="language"
                      name="language"
                      value={personalInfo.language}
                      onChange={handlePersonalInfoChange}
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es-ES">Español (España)</option>
                    </select>
                  </div>
                </div>
                <div className={styles.formActions}>
                  <button type="button" className={styles.cancelButton}>
                    Cancelar
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>

            <div className={styles.section}>
              <h2 className={styles.cardTitle}>Segurança da Conta</h2>
              <p>Gerencie suas credenciais de acesso e segurança da conta.</p>
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.submitButton} 
                  onClick={openPasswordModal}
                >
                  Alterar Senha
                </button>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.cardTitle}>Preferências de Notificação</h2>
              <form onSubmit={handleNotificationSubmit} className={styles.form}>
                <div className={styles.permissionsSection}>
                  <div className={styles.permissionsGrid}>
                    <div className={styles.permissionItem}>
                      <label>
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          checked={notifications.emailNotifications}
                          onChange={handleNotificationChange}
                        />
                        Notificações por E-mail
                      </label>
                    </div>
                    <div className={styles.permissionItem}>
                      <label>
                        <input
                          type="checkbox"
                          name="smsNotifications"
                          checked={notifications.smsNotifications}
                          onChange={handleNotificationChange}
                        />
                        Notificações por SMS
                      </label>
                    </div>
                    <div className={styles.permissionItem}>
                      <label>
                        <input
                          type="checkbox"
                          name="appNotifications"
                          checked={notifications.appNotifications}
                          onChange={handleNotificationChange}
                        />
                        Notificações no Aplicativo
                      </label>
                    </div>
                    <div className={styles.permissionItem}>
                      <label>
                        <input
                          type="checkbox"
                          name="newsletter"
                          checked={notifications.newsletter}
                          onChange={handleNotificationChange}
                        />
                        Receber Newsletter
                      </label>
                    </div>
                  </div>
                </div>
                <div className={styles.formActions}>
                  <button type="button" className={styles.cancelButton}>
                    Cancelar
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    Salvar Preferências
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {showPasswordModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3 className={styles.modalTitle}>Alterar Senha</h3>
              <form onSubmit={handlePasswordModalSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="currentPasswordModal">Senha Atual</label>
                  <input
                    type="password"
                    id="currentPasswordModal"
                    name="currentPassword"
                    value={passwordInfo.currentPassword}
                    onChange={handlePasswordInfoChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="newPasswordModal">Nova Senha</label>
                  <input
                    type="password"
                    id="newPasswordModal"
                    name="newPassword"
                    value={passwordInfo.newPassword}
                    onChange={handlePasswordInfoChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="confirmNewPasswordModal">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    id="confirmNewPasswordModal"
                    name="confirmNewPassword"
                    value={passwordInfo.confirmNewPassword}
                    onChange={handlePasswordInfoChange}
                  />
                </div>
                {passwordError && (
                  <p className={styles.errorMessage}>{passwordError}</p>
                )}
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={closePasswordModal}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    Salvar Nova Senha
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;