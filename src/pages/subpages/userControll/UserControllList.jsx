import React, { useState } from "react";
import { DataTable } from '../../../components';
import styles from '../../../styles/pages-styles/UserControllStyle.module.css';

const UserControllList = ({
  searchTerm,
  setSearchTerm,
}) => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Ana Silva",
      email: "ana.silva@email.com",
      userType: "Admin",
      status: "Ativo",
    },
    {
      id: 2,
      name: "Carlos Pereira",
      email: "carlos.pereira@email.com",
      userType: "Doutor",
      status: "Ativo",
    },
    {
      id: 3,
      name: "Mariana Costa",
      email: "mariana.costa@email.com",
      userType: "Atendente",
      status: "Inativo",
    },
    {
      id: 4,
      name: "Felipe Souza",
      email: "felipe.souza@email.com",
      userType: "Paciente",
      status: "Pendente",
    },
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUser, setEditedUser] = useState({ name: '', email: '', userType: '', status: '' });

  // --- Funções de Estilo (mantidas como estão) ---
  const getUserTypeStyle = (userType) => {
    switch (userType) {
      case "Admin":
        return { backgroundColor: "#fef2f2", color: "#dc2626" };
      case "Doutor":
        return { backgroundColor: "#eff6ff", color: "#2563eb" };
      case "Atendente":
        return { backgroundColor: "#ecfdf5", color: "#059669" };
      case "Paciente":
        return { backgroundColor: "#f5f3ff", color: "#7c3aed" };
      default:
        return { backgroundColor: "#e0e0e0", color: "#333333" };
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Ativo":
        return { backgroundColor: "#ecfdf5", color: "#059669" };
      case "Inativo":
        return { backgroundColor: "#fef2f2", color: "#dc2626" };
      case "Pendente":
        return { backgroundColor: "#fffbeb", color: "#d97706" };
      default:
        return { backgroundColor: "#e0e0e0", color: "#333333" };
    }
  };

  const handleDeleteClick = (userToDelete) => {
    setSelectedUser(userToDelete);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter(user => user.id !== selectedUser.id));
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleEditClick = (userToEdit) => {
    setSelectedUser(userToEdit);
    setEditedUser({ ...userToEdit }); 
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    setUsers(users.map(user =>
      user.id === editedUser.id ? editedUser : user
    ));
    setShowEditModal(false);
    setSelectedUser(null);
    setEditedUser({ name: '', email: '', userType: '', status: '' }); 
  };

  // Configuração das colunas para o DataTable
  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'email', label: 'E-mail' },
    { 
      key: 'userType', 
      label: 'Tipo',
      type: 'badge',
      badgeType: 'userType',
      render: (item) => (
        <span
          className={styles.badge}
          style={getUserTypeStyle(item.userType)}
        >
          {item.userType}
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      type: 'badge',
      render: (item) => (
        <span
          className={styles.badge}
          style={getStatusStyle(item.status)}
        >
          {item.status}
        </span>
      )
    },
    { key: 'actions', label: 'Ações', type: 'actions' }
  ];

  // Configuração dos estilos de badge
  const badgeConfig = {
    userType: {
      "Admin": { backgroundColor: "#fef2f2", color: "#dc2626" },
      "Doutor": { backgroundColor: "#eff6ff", color: "#2563eb" },
      "Atendente": { backgroundColor: "#ecfdf5", color: "#059669" },
      "Paciente": { backgroundColor: "#f5f3ff", color: "#7c3aed" }
    },
    status: {
      "Ativo": { backgroundColor: "#ecfdf5", color: "#059669" },
      "Inativo": { backgroundColor: "#fef2f2", color: "#dc2626" },
      "Pendente": { backgroundColor: "#fffbeb", color: "#d97706" }
    }
  };

  return (
    <div className={styles.card}>
      <DataTable
        title="Lista de Usuários"
        data={users}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        searchPlaceholder="Pesquisar usuários..."
        emptyMessage="Nenhum usuário encontrado. Crie um novo usuário para começar."
        badgeConfig={badgeConfig}
      />

      {showDeleteModal && selectedUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Confirmar Exclusão</h3>
            <p>Você tem certeza que deseja <b style={{textDecoration: 'underline', color: 'red'}}>EXCLUIR</b> o usuário <strong>{selectedUser.name}</strong>?</p>
            <div className={styles.modalActions}>
              <button onClick={confirmDelete} className={styles.confirmDeleteButton}>
                Excluir
              </button>
              <button onClick={() => setShowDeleteModal(false)} className={styles.cancelButton}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Editar Usuário</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Nome:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editedUser.name}
                  onChange={handleEditChange}
                  className={styles.inputField}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">E-mail:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleEditChange}
                  className={styles.inputField}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="userType">Tipo de Usuário:</label>
                <select
                  id="userType"
                  name="userType"
                  value={editedUser.userType}
                  onChange={handleEditChange}
                  className={styles.selectField}
                >
                  <option value="Admin">Admin</option>
                  <option value="Doutor">Doutor</option>
                  <option value="Atendente">Atendente</option>
                  <option value="Paciente">Paciente</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="status">Status:</label>
                <select
                  id="status"
                  name="status"
                  value={editedUser.status}
                  onChange={handleEditChange}
                  className={styles.selectField}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Pendente">Pendente</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowEditModal(false)} className={styles.cancelButton}>
                  Cancelar
                </button>
                <button type="submit" className={styles.saveButton}>
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserControllList;