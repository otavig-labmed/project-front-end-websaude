import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../../../styles/pages-styles/AgreementsStyle.module.css';

const AgreementsCreate = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: '',
        registroANS: '',
        ativo: true,
        telefone: '',
        email: '',
        site: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Dados do convênio:', formData);
        navigate('/convenios');
    };

    return (
       <div className={styles.scrollContainer}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.cardTitle}>Cadastrar Novo Convênio</h1>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="nome">Nome do Convênio*</label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                                placeholder="Ex: Unimed, Amil, etc."
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="registroANS">Registro ANS*</label>
                            <input
                                type="text"
                                id="registroANS"
                                name="registroANS"
                                value={formData.registroANS}
                                onChange={handleChange}
                                required
                                placeholder="Número de registro na ANS"
                            />
                        </div>
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="telefone">Telefone</label>
                            <input
                                type="tel"
                                id="telefone"
                                name="telefone"
                                value={formData.telefone}
                                onChange={handleChange}
                                placeholder="(00) 0000-0000"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="email@convenio.com"
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="site">Site</label>
                        <input
                            type="url"
                            id="site"
                            name="site"
                            value={formData.site}
                            onChange={handleChange}
                            placeholder="https://www.convenio.com.br"
                        />
                    </div>

                    <br />

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            onClick={() => navigate('/convenios')}
                            className={styles.cancelButton}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className={styles.submitButton}
                        >
                            Cadastrar Convênio
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgreementsCreate;