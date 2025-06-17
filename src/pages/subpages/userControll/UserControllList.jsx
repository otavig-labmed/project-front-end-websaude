import React, { useState } from "react";
import styles from '../../../styles/pages-styles/UserControllStyle.module.css';

// Import the necessary icons here
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'; // Added faEdit and faTrash

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

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.cardTitle}>Lista de Usuários</h2>
          <div className={styles.searchContainer}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Pesquisar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

      <div className={styles.scrollContainer}>
        {filteredUsers.length === 0 ? (
          <p className={styles.emptyMessage}>
            Nenhum usuário encontrado. Crie um novo usuário para começar.
          </p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th className={styles.actionsColumn}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={styles.badge}
                        style={getUserTypeStyle(user.userType)}
                      >
                        {user.userType}
                      </span>
                    </td>
                    <td>
                      <span
                        className={styles.badge}
                        style={getStatusStyle(user.status)}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className={styles.actionsCell}>
                      <button
                        onClick={() => handleEditClick(user)}
                        className={styles.editButton}
                        title="Editar Usuário" 
                      >
                        <FontAwesomeIcon icon={faEdit} className={styles.icon} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className={styles.deleteButton}
                        title="Excluir Usuário" 
                      >
                        <FontAwesomeIcon icon={faTrash} className={styles.icon} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showDeleteModal && selectedUser && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Confirmar Exclusão</h3>
              <p>Você tem certeza que deseja excluir o usuário <strong>{selectedUser.name}</strong>?</p>
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
    </div>
  );
};

export default UserControllList;