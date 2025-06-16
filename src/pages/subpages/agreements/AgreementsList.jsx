import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../styles/pages-styles/AgreementsStyle.module.css';

const AgreementsList = () => {
    const [agreements, setAgreements] = useState([
        { id: 1, nome: "Unimed", registroANS: "123456", ativo: true },
        { id: 2, nome: "Amil", registroANS: "654321", ativo: true },
        { id: 3, nome: "Bradesco Saúde", registroANS: "987654", ativo: false },
        { id: 4, nome: "SulAmérica", registroANS: "456789", ativo: true },
        { id: 5, nome: "NotreDame Intermédica", registroANS: "321654", ativo: true },
        { id: 6, nome: "NotreDame Intermédica", registroANS: "321654", ativo: true },
        { id: 5, nome: "NotreDame Teste", registroANS: "321654", ativo: true },
    ]);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [agreementToDelete, setAgreementToDelete] = useState(null);

    const handleDeleteClick = (agreement) => {
        setAgreementToDelete(agreement);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (agreementToDelete) {
            setAgreements(agreements.filter(ag => ag.id !== agreementToDelete.id));
            setShowDeleteConfirm(false);
            setAgreementToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setAgreementToDelete(null);
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.cardTitle}>Lista de Convênios</h1>

                    <div className={styles.searchContainer}>
                        <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Pesquisar convênio..."
                            className={styles.searchInput} 
                        />
                    </div>
                </div>

                <div className={styles.scrollContainer}>
                    {agreements.length > 0 ? (
                        <div className={styles.tableContainer}>
                            <table className={styles.userTable}>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Registro ANS</th>
                                        <th>Status</th>
                                        <th className={styles.actionsColumn}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {agreements.map((agreement) => (
                                        <tr key={agreement.id}>
                                            <td>{agreement.nome}</td>
                                            <td>{agreement.registroANS}</td>
                                            <td>
                                                <span className={`${styles.badge} ${
                                                    agreement.ativo ? styles.activeBadge : styles.inactiveBadge
                                                }`}>
                                                    {agreement.ativo ? "Ativo" : "Inativo"}
                                                </span>
                                            </td>
                                            <td className={styles.actionsCell}>
                                                <button className={styles.editButton}>
                                                    <FontAwesomeIcon icon={faEdit} className={styles.icon} />
                                                </button>
                                                <button
                                                    className={styles.deleteButton}
                                                    onClick={() => handleDeleteClick(agreement)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} className={styles.icon} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className={styles.emptyMessage}>
                            Nenhum convênio cadastrado
                        </div>
                    )}
                </div>
            </div>

            {showDeleteConfirm && agreementToDelete && (
                <div className={styles.overlay}>
                    <div className={styles.confirmModal}>
                        <p>Tem certeza que deseja apagar o convênio **{agreementToDelete.nome}**?</p>
                        <div className={styles.modalActions}>
                            <button className={styles.cancelButton} onClick={cancelDelete}>Cancelar</button>
                            <button className={styles.confirmButton} onClick={confirmDelete}>Apagar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgreementsList;