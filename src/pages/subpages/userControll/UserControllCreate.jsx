import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { 
	Form, 
	FormSection, 
	FormField, 
	FormGrid, 
	CheckboxGroup, 
} from "../../../components";
import styles from '../../../styles/pages-styles/UserControllStyle.module.css';

const UserControllCreate = () => {
	const { id: userIdFromRoute } = useParams();
	const navigate = useNavigate();

	// Estados básicos
	const [nome, setNome] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [cpf, setCpf] = useState("");
	const [rg, setRg] = useState("");
	const [endereco, setEndereco] = useState("");
	const [telefone, setTelefone] = useState("");
	const [regra, setRegra] = useState("Patient");
	const [is_active, setIsActive] = useState(true);

	// Estados para Médico
	const [crm, setCrm] = useState("");
	const [especialidade, setEspecialidade] = useState("");

	// Estados para Paciente
	const [plano_saude, setPlanoSaude] = useState("");
	const [tipo_sanguineo, setTipoSanguineo] = useState("");
	const [contato_emergencia, setContatoEmergencia] = useState("");

	const permissoesPadrao = {
		Admin: {
			dashboard: true,
			criar_usuario: true,
			editar_usuario: true,
			visualizar_prontuarios: true,
			criar_prontuarios: true,
			agendar_consultas: true,
			relatorios: true,
			configuracoes: true
		},
		Attendant: {
			dashboard: true,
			criar_usuario: false,
			editar_usuario: false,
			visualizar_prontuarios: true,
			criar_prontuarios: false,
			agendar_consultas: true,
			relatorios: false,
			configuracoes: false
		},
		Doctor: {
			dashboard: true,
			criar_usuario: false,
			editar_usuario: false,
			visualizar_prontuarios: true,
			criar_prontuarios: true,
			agendar_consultas: true,
			relatorios: false,
			configuracoes: false
		},
		Patient: {
			dashboard: true,
			criar_usuario: false,
			editar_usuario: false,
			visualizar_prontuarios: false,
			criar_prontuarios: false,
			agendar_consultas: false,
			relatorios: false,
			configuracoes: false
		}
	};

	// Estado para permissões
	const [permissoes, setPermissoes] = useState(permissoesPadrao.Patient);

	// Estados auxiliares
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);

	// Opções para selects
	const regraOptions = [
		{ value: 'Admin', label: 'Administrador' },
		{ value: 'Attendant', label: 'Atendente' },
		{ value: 'Doctor', label: 'Médico' },
		{ value: 'Patient', label: 'Paciente' }
	];

	const tipoSanguineoOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

	const isEditing = !!userIdFromRoute;

	// Função para atualizar permissões quando o tipo de usuário muda
	const handleRegraChange = (e) => {
		const novaRegra = e.target.value;
		setRegra(novaRegra);
		setPermissoes(permissoesPadrao[novaRegra]);
	};

	// Simulação de API
	const fetchUserData = async (id) => {
		return new Promise((resolve) => setTimeout(() => {
			resolve({
				nome: "João Silva",
				email: "joao.silva@example.com",
				cpf: "12345678901",
				rg: "123456789",
				endereco: "Rua Exemplo, 123",
				telefone: "11987654321",
				regra: "Doctor",
				is_active: true,
				crm: "CRM/SP 123456",
				especialidade: "Cardiologia",
				plano_saude: "Unimed",
				tipo_sanguineo: "A+",
				contato_emergencia: "Maria Silva (11) 98765-4321",
				permissoes: permissoesPadrao['Doctor']
			});
		}, 500));
	};

	const saveUserData = async (userData, id) => {
		return new Promise((resolve) => setTimeout(() => {
			console.log(id ? "Atualizando usuário" : "Criando usuário", userData);
			resolve({
				id: id || "novoID123",
				...userData,
				message: id ? "Usuário atualizado!" : "Usuário criado!"
			});
		}, 1000));
	};

	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			try {
				if (isEditing) {
					const userData = await fetchUserData(userIdFromRoute);
					setNome(userData.nome);
					setEmail(userData.email);
					setCpf(userData.cpf);
					setRg(userData.rg);
					setEndereco(userData.endereco);
					setTelefone(userData.telefone);
					setRegra(userData.regra);
					setIsActive(userData.is_active);

					if (userData.regra === 'Doctor') {
						setCrm(userData.crm);
						setEspecialidade(userData.especialidade);
					}

					if (userData.regra === 'Patient') {
						setPlanoSaude(userData.plano_saude);
						setTipoSanguineo(userData.tipo_sanguineo);
						setContatoEmergencia(userData.contato_emergencia);
					}

					setPermissoes(userData.permissoes || permissoesPadrao[userData.regra]);
				}
			} catch (error) {
				setErrorMessage(`Erro ao carregar: ${error.message}`);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [userIdFromRoute, isEditing]);

	const handlePermissaoChange = (newPermissoes) => {
		setPermissoes(newPermissoes);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		setErrorMessage(null);

		const userData = {
			nome,
			email,
			cpf,
			rg,
			endereco,
			telefone,
			regra,
			is_active,
			permissoes
		};

		if (password) {
			userData.password = password;
		}

		if (regra === 'Doctor') {
			userData.crm = crm;
			userData.especialidade = especialidade;
		}

		if (regra === 'Patient') {
			userData.plano_saude = plano_saude;
			userData.tipo_sanguineo = tipo_sanguineo;
			userData.contato_emergencia = contato_emergencia;
		}

		try {
			const result = await saveUserData(userData, isEditing ? userIdFromRoute : null);
			setSuccessMessage(result.message);

			if (!isEditing) {
				resetForm();
			}
		} catch (error) {
			setErrorMessage(`Erro ao salvar: ${error.message}`);
		} finally {
			setSaving(false);
		}
	};

	const resetForm = () => {
		setNome("");
		setEmail("");
		setPassword("");
		setCpf("");
		setRg("");
		setEndereco("");
		setTelefone("");
		setRegra("Patient");
		setIsActive(true);
		setCrm("");
		setEspecialidade("");
		setPlanoSaude("");
		setTipoSanguineo("");
		setContatoEmergencia("");
		setPermissoes(permissoesPadrao.Patient);
	};

	const handleCancel = () => {
		navigate('/users');
	};

	const permissaoOptions = [
		{ key: 'dashboard', label: 'Visualizar Dashboard' },
		{ key: 'criar_usuario', label: 'Criar Usuários' },
		{ key: 'editar_usuario', label: 'Editar Usuários' },
		{ key: 'visualizar_prontuarios', label: 'Visualizar Prontuários' },
		{ key: 'criar_prontuarios', label: 'Criar Prontuários' },
		{ key: 'agendar_consultas', label: 'Agendar Consultas' },
		{ key: 'relatorios', label: 'Gerar Relatórios' },
		{ key: 'configuracoes', label: 'Acessar Configurações' }
	];

	if (loading) {
		return (
			<div className={styles.card}>
				<h2 className={styles.cardTitle}>Carregando...</h2>
			</div>
		);
	}

	return (
		<div className={`${styles["page-container"]} ${styles["user-create-container"]}`}>
			{errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
			{successMessage && <div className={styles.successMessage}>{successMessage}</div>}

			<Form
				onSubmit={handleSubmit}
				onCancel={handleCancel}
				onReset={resetForm}
				loading={saving}
				submitText={isEditing ? "Atualizar" : "Criar"}
				showReset={!isEditing}
				className={styles["user-form"]}
			>
				<FormSection title="Informações Básicas">
					<FormGrid columns={2}>
						<FormField
							label="Nome Completo"
							type="text"
							id="nome"
							name="nome"
							value={nome}
							onChange={(e) => setNome(e.target.value)}
							placeholder="Ex: João Almeida dos Santos"
							required
						/>
						<FormField
							label="E-mail"
							type="email"
							id="email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Ex: joaoalmeida@gmail.com"
							required
						/>
					</FormGrid>

					<FormGrid columns={2}>
						<FormField
							label="Senha"
							type="password"
							id="password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder={isEditing ? "Deixe em branco para manter a atual" : ""}
						/>
						<FormField
							label="Tipo de Usuário"
							type="select"
							id="regra"
							name="regra"
							value={regra}
							onChange={handleRegraChange}
							options={regraOptions}
							required
						/>
					</FormGrid>
				</FormSection>

				<FormSection title="Documentos">
					<FormGrid columns={2}>
						<FormField
							label="CPF"
							type="text"
							id="cpf"
							name="cpf"
							value={cpf}
							onChange={(e) => setCpf(e.target.value)}
							placeholder="Ex: 000.000.000-00"
							maxLength="11"
						/>
						<FormField
							label="RG"
							type="text"
							id="rg"
							name="rg"
							value={rg}
							onChange={(e) => setRg(e.target.value)}
							placeholder="Ex: 00.000.000-0"
							maxLength="9"
						/>
					</FormGrid>
				</FormSection>

				<FormSection title="Contato">
					<FormGrid columns={2}>
						<FormField
							label="Endereço"
							type="text"
							id="endereco"
							name="endereco"
							value={endereco}
							onChange={(e) => setEndereco(e.target.value)}
							placeholder="Ex: Rua Joaquim Nabuco, 402 - Casa"
							required
						/>
						<FormField
							label="Telefone"
							type="text"
							id="telefone"
							name="telefone"
							value={telefone}
							onChange={(e) => setTelefone(e.target.value)}
							placeholder="(00) 00000-0000"
							maxLength="15"
						/>
					</FormGrid>
				</FormSection>

				{regra === 'Doctor' && (
					<FormSection title="Informações Médicas">
						<FormGrid columns={2}>
							<FormField
								label="CRM"
								type="text"
								id="crm"
								name="crm"
								value={crm}
								onChange={(e) => setCrm(e.target.value)}
								placeholder="CRM/UF 123456"
								required
							/>
							<FormField
								label="Especialidade"
								type="text"
								id="especialidade"
								name="especialidade"
								value={especialidade}
								onChange={(e) => setEspecialidade(e.target.value)}
								required
							/>
						</FormGrid>
					</FormSection>
				)}

				{regra === 'Patient' && (
					<FormSection title="Informações do Paciente">
						<FormGrid columns={2}>
							<FormField
								label="Plano de Saúde"
								type="text"
								id="plano_saude"
								name="plano_saude"
								value={plano_saude}
								onChange={(e) => setPlanoSaude(e.target.value)}
							/>
							<FormField
								label="Tipo Sanguíneo"
								type="select"
								id="tipo_sanguineo"
								name="tipo_sanguineo"
								value={tipo_sanguineo}
								onChange={(e) => setTipoSanguineo(e.target.value)}
								options={tipoSanguineoOptions}
							/>
						</FormGrid>
						<FormField
							label="Contato de Emergência"
							type="text"
							id="contato_emergencia"
							name="contato_emergencia"
							value={contato_emergencia}
							onChange={(e) => setContatoEmergencia(e.target.value)}
							placeholder="Nome e telefone"
						/>
					</FormSection>
				)}

				<FormSection 
					title="Permissões do Usuário" 
					collapsible={true}
					defaultOpen={true}
				>
					<CheckboxGroup
						options={permissaoOptions}
						values={permissoes}
						onChange={handlePermissaoChange}
						columns={2}
					/>
				</FormSection>
			</Form>
		</div>
	);
};

export default UserControllCreate;