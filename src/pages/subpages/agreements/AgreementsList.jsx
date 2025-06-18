import React, { useState } from "react";
import { DataTable } from '../../../components';
import styles from '../../../styles/pages-styles/AgreementsStyle.module.css';

const AgreementsList = () => {
    const [agreements, setAgreements] = useState([
        { id: 1, nome: "Unimed", registroANS: "123456", ativo: true },
        { id: 2, nome: "Amil", registroANS: "654321", ativo: true },
        { id: 3, nome: "Bradesco Saúde", registroANS: "987654", ativo: false },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [agreementToDelete, setAgreementToDelete] = useState(null);

    const [editingAgreement, setEditingAgreement] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [formData, setFormData] = useState({ nome: "", registroANS: "", ativo: true });

    const handleDeleteClick = (agreement) => {
        setAgreementToDelete(agreement);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        setAgreements(agreements.filter(ag => ag.id !== agreementToDelete.id));
        cancelDelete();
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setAgreementToDelete(null);
    };

    const handleEditClick = (agreement) => {
        setEditingAgreement(agreement);
        setFormData({ ...agreement });
        setShowFormModal(true);
    };

    const handleAddClick = () => {
        setEditingAgreement(null);
        setFormData({ nome: "", registroANS: "", ativo: true });
        setShowFormModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleFormSubmit = () => {
        if (editingAgreement) {
            setAgreements(prev => prev.map(ag =>
                ag.id === editingAgreement.id ? { ...editingAgreement, ...formData } : ag
            ));
        } else {
            const newAgreement = {
                id: agreements.length + 1,
                ...formData
            };
            setAgreements(prev => [...prev, newAgreement]);
        }
        setShowFormModal(false);
    };

    // Configuração das colunas para o DataTable
    const columns = [
        { key: 'nome', label: 'Nome' },
        { key: 'registroANS', label: 'Registro ANS' },
        { 
            key: 'ativo', 
            label: 'Status',
            type: 'status',
            render: (item) => (
                <span className={`${styles.badge} ${
                    item.ativo ? styles.activeBadge : styles.inactiveBadge
                }`}>
                    {item.ativo ? "Ativo" : "Inativo"}
                </span>
            )
        },
        { key: 'actions', label: 'Ações', type: 'actions' }
    ];

    return (
        <div className={styles.pageContainer}>
            <DataTable
                title="Lista de Convênios"
                data={agreements}
                columns={columns}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                searchPlaceholder="Pesquisar convênio..."
                emptyMessage="Nenhum convênio encontrado. Cadastre um novo convênio para começar."
            />

            {showDeleteConfirm && agreementToDelete && (
                <div className={styles.modalOverlay}> 
                    <div className={styles.modalContent}> 
                        <p>Tem certeza que deseja <b style={{textDecoration: 'underline', color: 'red'}}>EXCLUIR</b> o convênio <strong>{agreementToDelete.nome}</strong>?</p>
                        <div className={styles.modalActions}>
                            <button className={styles.confirmDeleteButton} onClick={confirmDelete}>Excluir</button> 
                            <button className={styles.cancelButton} onClick={cancelDelete}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {showFormModal && (
                <div className={styles.modalOverlay}> 
                    <div className={styles.modalContent}>
                        <h3>{editingAgreement ? "Editar Convênio" : "Novo Convênio"}</h3>
                        <input
                            type="text"
                            name="nome"
                            placeholder="Nome"
                            value={formData.nome}
                            onChange={handleFormChange}
                            className={styles.modalInput}
                        />
                        <input
                            type="text"
                            name="registroANS"
                            placeholder="Registro ANS"
                            value={formData.registroANS}
                            onChange={handleFormChange}
                            className={styles.modalInput}
                        />
                        <label className={styles.switchLabel}>
                            <input
                                type="checkbox"
                                name="ativo"
                                checked={formData.ativo}
                                onChange={handleFormChange}
                            />
                            Ativo
                        </label>

                        <div className={styles.modalActions}>
                            <button className={styles.cancelButton} onClick={() => setShowFormModal(false)}>Cancelar</button>
                            <button className={styles.saveButton} onClick={handleFormSubmit}>
                                {editingAgreement ? "Salvar Alterações" : "Adicionar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgreementsList;