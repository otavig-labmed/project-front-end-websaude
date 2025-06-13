import React, {useState} from "react";
import styles from '../../../styles/pages-styles/UserControllStyle.module.css';

const UserControllList = ({  
  searchTerm, 
  setSearchTerm, 
  handleEdit, 
  handleDelete 
}) => {

	const [users, setUsers] = useState([]);

	const getUserTypeStyle = (userType) => {
	    switch(userType) {
	      case "Admin":
	        return { backgroundColor: "#fef2f2", color: "#dc2626" };
	      case "Doutor":
	        return { backgroundColor: "#eff6ff", color: "#2563eb" };
	      case "Atendente":
	        return { backgroundColor: "#ecfdf5", color: "#059669" };
	      default:
	        return { backgroundColor: "#f5f3ff", color: "#7c3aed" };
	    }
	  };

  	const getStatusStyle = (status) => {
	    switch(status) {
	      case "Ativo":
	        return { backgroundColor: "#ecfdf5", color: "#059669" };
	      case "Inativo":
	        return { backgroundColor: "#fef2f2", color: "#dc2626" };
	      default:
	        return { backgroundColor: "#fffbeb", color: "#d97706" };
	    }
	  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.cardTitle}>Lista de Usuários</h2>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Pesquisar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
      </div>
      
      {users.length === 0 ? (
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
              {users.map(user => (
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
                      onClick={() => handleEdit(user)}
                      className={styles.editButton}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className={styles.deleteButton}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserControllList;