import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from '../../styles/components-styles/DataTable.module.css';

const DataTable = ({
  title,
  data,
  columns,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  onAdd,
  emptyMessage,
  showSearch = true,
  showAddButton = false,
  addButtonText = "Adicionar",
  searchPlaceholder = "Pesquisar...",
  statusConfig = {},
  badgeConfig = {}
}) => {
  const getStatusStyle = (status) => {
    if (statusConfig[status]) {
      return statusConfig[status];
    }
    
    // Estilos padrão para status
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

  const getBadgeStyle = (value, type) => {
    if (badgeConfig[type] && badgeConfig[type][value]) {
      return badgeConfig[type][value];
    }
    
    // Estilos padrão para tipos de usuário
    if (type === 'userType') {
      switch (value) {
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
    }
    
    return null;
  };

  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item);
    }

    if (column.type === 'status') {
      const style = getStatusStyle(item[column.key]);
      return (
        <span className={styles.badge} style={style}>
          {item[column.key]}
        </span>
      );
    }

    if (column.type === 'badge') {
      const style = getBadgeStyle(item[column.key], column.badgeType);
      return (
        <span className={styles.badge} style={style}>
          {item[column.key]}
        </span>
      );
    }

    if (column.type === 'actions') {
      return (
        <div className={styles.actionsCell}>
          {onEdit && (
            <button 
              className={styles.editButton} 
              onClick={() => onEdit(item)}
              title="Editar"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
          )}
          {onDelete && (
            <button 
              className={styles.deleteButton} 
              onClick={() => onDelete(item)}
              title="Excluir"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>
      );
    }

    return item[column.key];
  };

  const filteredData = data.filter(item =>
    columns.some(column => {
      if (column.type === 'actions') return false;
      const value = item[column.key];
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.cardTitle}>{title}</h2>
        
        <div className={styles.headerActions}>
          {showSearch && (
            <div className={styles.searchContainer}>
              <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          )}
          
          {showAddButton && onAdd && (
            <button className={styles.addButton} onClick={onAdd}>
              {addButtonText}
            </button>
          )}
        </div>
      </div>

      <div className={styles.scrollContainer}>
        {filteredData.length === 0 ? (
          <p className={styles.emptyMessage}>
            {emptyMessage || "Nenhum item encontrado."}
          </p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th 
                      key={index}
                      className={column.type === 'actions' ? styles.actionsColumn : ''}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, rowIndex) => (
                  <tr key={item.id || rowIndex}>
                    {columns.map((column, colIndex) => (
                      <td key={colIndex}>
                        {renderCell(item, column)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable; 