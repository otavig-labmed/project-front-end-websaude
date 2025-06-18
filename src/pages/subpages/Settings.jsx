import React, { useState } from "react";
import { 
  Form, 
  FormSection, 
  FormField, 
  FormGrid, 
  CheckboxGroup, 
  Modal 
} from "../../components";
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

  const handleNotificationChange = (newNotifications) => {
    setNotifications(newNotifications);
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

  const notificationOptions = [
    { key: 'emailNotifications', label: 'Notificações por E-mail' },
    { key: 'smsNotifications', label: 'Notificações por SMS' },
    { key: 'appNotifications', label: 'Notificações no Aplicativo' },
    { key: 'newsletter', label: 'Receber Newsletter' }
  ];

  const languageOptions = [
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'en-US', label: 'English (US)' },
    { value: 'es-ES', label: 'Español (España)' }
  ];

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.pageContainer}>
        <div className={styles.formContainer}>
          <div className={styles.card}>
            <h1 className={styles.mainCardTitle}>Configurações da Conta</h1>

            <FormSection title="Informações Pessoais">
              <form onSubmit={handlePersonalInfoSubmit} className={styles.form}>
                <FormGrid columns={2}>
                  <FormField
                    label="Nome Completo"
                    type="text"
                    id="name"
                    name="name"
                    value={personalInfo.name}
                    onChange={handlePersonalInfoChange}
                    required
                  />
                  <FormField
                    label="Email"
                    type="email"
                    id="email"
                    name="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    disabled
                  />
                  <FormField
                    label="Telefone"
                    type="tel"
                    id="phone"
                    name="phone"
                    value={personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                  />
                  <FormField
                    label="Idioma Preferencial"
                    type="select"
                    id="language"
                    name="language"
                    value={personalInfo.language}
                    onChange={handlePersonalInfoChange}
                    options={languageOptions}
                  />
                </FormGrid>
                <div className={styles.formActions}>
                  <button type="button" className={styles.cancelButton}>
                    Cancelar
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </FormSection>

            <FormSection 
              title="Segurança da Conta"
              description="Gerencie suas credenciais de acesso e segurança da conta."
            >
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.submitButton} 
                  onClick={openPasswordModal}
                >
                  Alterar Senha
                </button>
              </div>
            </FormSection>

            <FormSection title="Preferências de Notificação">
              <form onSubmit={handleNotificationSubmit} className={styles.form}>
                <CheckboxGroup
                  options={notificationOptions}
                  values={notifications}
                  onChange={handleNotificationChange}
                  columns={2}
                />
                <div className={styles.formActions}>
                  <button type="button" className={styles.cancelButton}>
                    Cancelar
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    Salvar Preferências
                  </button>
                </div>
              </form>
            </FormSection>
          </div>
        </div>

        <Modal
          isOpen={showPasswordModal}
          onClose={closePasswordModal}
          title="Alterar Senha"
          size="small"
        >
          <form onSubmit={handlePasswordModalSubmit} className={styles.form}>
            <FormField
              label="Senha Atual"
              type="password"
              id="currentPasswordModal"
              name="currentPassword"
              value={passwordInfo.currentPassword}
              onChange={handlePasswordInfoChange}
              required
            />
            <FormField
              label="Nova Senha"
              type="password"
              id="newPasswordModal"
              name="newPassword"
              value={passwordInfo.newPassword}
              onChange={handlePasswordInfoChange}
              required
            />
            <FormField
              label="Confirmar Nova Senha"
              type="password"
              id="confirmNewPasswordModal"
              name="confirmNewPassword"
              value={passwordInfo.confirmNewPassword}
              onChange={handlePasswordInfoChange}
              required
            />
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
        </Modal>
      </div>
    </div>
  );
};

export default Settings;