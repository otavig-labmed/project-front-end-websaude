import React, { useState, useEffect } from "react";
// Importar estilos de forma consistente
import styles from '../../../styles/pages-styles/UserControllStyle.module.css';
// Importar useNavigate e useParams para gerenciar a rota e IDs
import { useNavigate, useParams } from 'react-router-dom';

// O componente UserControllCreate agora gerencia seu próprio estado e lógica.
// Ele não recebe mais props de dados ou manipulação de formulário,
// mas ainda pode receber props como `userTypes` e `statusOptions` se forem globais
// ou fetched de um contexto. Para este exemplo, vamos simular o fetch deles aqui.
const UserControllCreate = () => {
  // Use useParams para obter o ID do usuário da URL (se estiver no modo de edição)
  const { id: userIdFromRoute } = useParams();
  const navigate = useNavigate(); // Hook para navegação

  // Estados locais para os campos do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(""); // Valor inicial vazio
  const [status, setStatus] = useState(""); // Valor inicial vazio

  // Estados para carregamento e mensagens de feedback
  const [loading, setLoading] = useState(true); // Para carregar dados do usuário ou opções
  const [saving, setSaving] = useState(false); // Para quando o formulário está sendo enviado
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Estados para as opções de select (simulando fetch de API)
  const [userTypesOptions, setUserTypesOptions] = useState([]);
  const [statusOptionsList, setStatusOptionsList] = useState([]);

  // Determine se estamos no modo de edição
  const isEditing = !!userIdFromRoute;

  // --- Funções de Simulação de API ---
  // Em uma aplicação real, estas seriam chamadas a um backend
  const fetchUserTypes = async () => {
    // Simula uma chamada de API para obter tipos de usuário
    return new Promise(resolve => setTimeout(() => {
      resolve(["Administrador", "Atendente", "Médico", "Paciente"]);
    }, 300));
  };

  const fetchStatusOptions = async () => {
    // Simula uma chamada de API para obter opções de status
    return new Promise(resolve => setTimeout(() => {
      resolve(["Ativo", "Inativo", "Pendente"]);
    }, 300));
  };

  const fetchUserData = async (id) => {
    // Simula uma chamada de API para obter dados de um usuário existente
    return new Promise((resolve, reject) => setTimeout(() => {
      if (id === "123") { // Exemplo de um usuário mock
        resolve({
          name: "João Silva",
          email: "joao.silva@example.com",
          userType: "Médico",
          status: "Ativo"
        });
      } else {
        reject(new Error("Usuário não encontrado."));
      }
    }, 500));
  };

  const saveUserData = async (userData, id) => {
    // Simula uma chamada de API para criar ou atualizar um usuário
    return new Promise((resolve, reject) => setTimeout(() => {
      if (id) {
        console.log("Atualizando usuário:", id, userData);
        // Simula erro de atualização para demonstração
        if (userData.email === "erro@email.com") {
          reject(new Error("Erro ao atualizar o e-mail."));
        } else {
          resolve({ id: id, ...userData, message: "Usuário atualizado com sucesso!" });
        }
      } else {
        console.log("Criando novo usuário:", userData);
        // Simula erro de criação para demonstração
        if (userData.email === "erro@email.com") {
          reject(new Error("E-mail já cadastrado."));
        } else {
          resolve({ id: "novoID123", ...userData, message: "Usuário criado com sucesso!" });
        }
      }
    }, 1000));
  };
  // --- Fim das Funções de Simulação de API ---


  // useEffect para carregar dados do usuário (se for edição) e opções de select
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      try {
        // Carrega opções para os selects
        const types = await fetchUserTypes();
        setUserTypesOptions(types);
        setUserType(types[0] || ""); // Define o primeiro como padrão

        const statuses = await fetchStatusOptions();
        setStatusOptionsList(statuses);
        setStatus(statuses[0] || ""); // Define o primeiro como padrão

        // Se estiver editando, carrega os dados do usuário
        if (isEditing) {
          const userData = await fetchUserData(userIdFromRoute);
          setName(userData.name || "");
          setEmail(userData.email || "");
          setUserType(userData.userType || types[0] || "");
          setStatus(userData.status || statuses[0] || "");
          setPassword(""); // Senha nunca é pré-preenchida por segurança
        } else {
          // No modo de criação, garante que os campos estejam limpos
          setName("");
          setEmail("");
          setPassword("");
          setUserType(types[0] || "");
          setStatus(statuses[0] || "");
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setErrorMessage(`Falha ao carregar dados: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userIdFromRoute, isEditing]); // Dependências: re-executa se o ID ou modo de edição mudar

  // Função para lidar com a mudança em qualquer campo de input/select
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "userType":
        setUserType(value);
        break;
      case "status":
        setStatus(value);
        break;
      default:
        break;
    }
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o recarregamento da página

    setSaving(true); // Indica que a operação de salvamento está em andamento
    setErrorMessage(null); // Limpa mensagens de erro anteriores
    setSuccessMessage(null); // Limpa mensagens de sucesso anteriores

    // Cria um objeto com os dados do formulário
    const userData = {
      name,
      email,
      userType,
      status,
    };

    // Apenas inclui a senha se ela foi digitada (necessário para criação ou atualização)
    if (password) {
      userData.password = password;
    }

    try {
      // Chama a função de salvamento de dados (criar ou atualizar)
      const result = await saveUserData(userData, isEditing ? userIdFromRoute : null);
      setSuccessMessage(result.message || (isEditing ? "Usuário atualizado!" : "Usuário criado!"));
      // Se for criação, opcionalmente limpa o formulário
      if (!isEditing) {
        setName("");
        setEmail("");
        setPassword("");
        setUserType(userTypesOptions[0] || "");
        setStatus(statusOptionsList[0] || "");
      }
      // Opcional: Navegar após um pequeno atraso para o usuário ver a mensagem de sucesso
      setTimeout(() => navigate('/users'), 1500); // Navega para a lista de usuários
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      setErrorMessage(`Falha ao salvar: ${error.message}`);
    } finally {
      setSaving(false); // Finaliza a operação de salvamento
    }
  };

  // Função para lidar com o cancelamento da edição/criação
  const handleCancel = () => {
    navigate('/users'); // Navega de volta para a lista de usuários
  };

  if (loading) {
    return (
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Carregando...</h2>
        <p>Aguarde enquanto os dados são carregados.</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        {isEditing ? "Editar Usuário" : "Criar Usuário"}
      </h2>

      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nome Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              // A senha é obrigatória apenas para criação de novo usuário
              required={!isEditing}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="userType">Tipo de Usuário</label>
            <select
              id="userType"
              name="userType"
              value={userType}
              onChange={handleInputChange}
              required
            >
              {userTypesOptions.length > 0 ? (
                userTypesOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))
              ) : (
                <option value="">Carregando tipos...</option>
              )}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={handleInputChange}
              required
            >
              {statusOptionsList.length > 0 ? (
                statusOptionsList.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))
              ) : (
                <option value="">Carregando status...</option>
              )}
            </select>
          </div>
        </div>

        <div className={styles.formActions}>
          {isEditing && ( // Botão 'Cancelar' aparece apenas no modo de edição
            <button
              type="button"
              onClick={handleCancel} // Agora chama a função handleCancel interna
              className={styles.cancelButton}
              disabled={saving}
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={saving} // Desabilita durante o salvamento
          >
            {saving ? "Salvando..." : (isEditing ? "Atualizar Usuário" : "Criar Usuário")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserControllCreate;
