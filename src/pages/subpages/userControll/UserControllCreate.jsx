import React, { useState, useEffect } from "react";
import styles from '../../../styles/pages-styles/UserControllStyle.module.css';
import { useNavigate, useParams } from 'react-router-dom';

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
	const estadoCivilOptions = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'Separado(a)'];
	const sexoOptions = ['Masculino', 'Feminino', 'Outro', 'Prefiro não dizer'];

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

	const handlePermissaoChange = (permissao) => {
		setPermissoes(prev => ({
			...prev,
			[permissao]: !prev[permissao]
		}));
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

	if (loading) {
		return (
			<div className={styles.card}>
				<h2 className={styles.cardTitle}>Carregando...</h2>
			</div>
		);
	}

	return (
		<div className={styles["page-container"]}>
			<div className={styles.card}>
				<h2 className={styles.cardTitle}>
					{isEditing ? "Editar Usuário" : "Criar Usuário"}
				</h2>

				{errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
				{successMessage && <div className={styles.successMessage}>{successMessage}</div>}

				<br />
				<form onSubmit={handleSubmit} className={styles.form}>
					<div className={styles.formGrid}>
						<div className={styles.formGroup}>
							<label htmlFor="nome">Nome Completo*</label>
							<input
								type="text"
								id="nome"
								placeholder="Ex: João Almeida dos Santos"
								value={nome}
								onChange={(e) => setNome(e.target.value)}
								required
							/>
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="email">E-mail*</label>
							<input
								type="email"
								id="email"
								placeholder="Ex: joaoalmeida@gmail.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
					</div>

					<div className={styles.formGrid}>
						<div className={styles.formGroup}>
							<label htmlFor="password">Senha {!isEditing && "(Opcional)"}</label>
							<input
								type="password"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder={isEditing ? "Deixe em branco para manter a atual" : ""}
							/>
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="regra">Tipo de Usuário*</label>
							<select
								id="regra"
								value={regra}
								onChange={handleRegraChange}
								required
							>
								{regraOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className={styles.formGrid}>
						<div className={styles.formGroup}>
							<label htmlFor="cpf">CPF</label>
							<input
								type="text"
								id="cpf"
								placeholder="Ex: 000.000.000-00"
								value={cpf}
								onChange={(e) => setCpf(e.target.value)}
								maxLength="11"
							/>
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="rg">RG</label>
							<input
								type="text"
								id="rg"
								placeholder="Ex: 00.000.000-0"
								value={rg}
								onChange={(e) => setRg(e.target.value)}
								maxLength="9"
							/>
						</div>
					</div>

					<div className={styles.formGrid}>
						<div className={styles.formGroup}>
							<label htmlFor="endereco">Endereço*</label>
							<input
								type="text"
								id="endereco"
								placeholder="Ex: Rua Joaquim Nabuco, 402 - Casa"
								value={endereco}
								onChange={(e) => setEndereco(e.target.value)}
								required
							/>
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="telefone">Telefone</label>
							<input
								type="text"
								id="telefone"
								value={telefone}
								onChange={(e) => setTelefone(e.target.value)}
								maxLength="15"
								placeholder="(00) 00000-0000"
							/>
						</div>
					</div>

					{/* Campos específicos para Médico */}
					{regra === 'Doctor' && (
						<div className={styles.formGrid}>
							<div className={styles.formGroup}>
								<label htmlFor="crm">CRM*</label>
								<input
									type="text"
									id="crm"
									value={crm}
									onChange={(e) => setCrm(e.target.value)}
									required
									placeholder="CRM/UF 123456"
								/>
							</div>

							<div className={styles.formGroup}>
								<label htmlFor="especialidade">Especialidade*</label>
								<input
									type="text"
									id="especialidade"
									value={especialidade}
									onChange={(e) => setEspecialidade(e.target.value)}
									required
								/>
							</div>
						</div>
					)}

					{/* Campos específicos para Paciente */}
					{regra === 'Patient' && (
						<>
							<div className={styles.formGrid}>
								<div className={styles.formGroup}>
									<label htmlFor="plano_saude">Plano de Saúde</label>
									<input
										type="text"
										id="plano_saude"
										value={plano_saude}
										onChange={(e) => setPlanoSaude(e.target.value)}
									/>
								</div>

								<div className={styles.formGroup}>
									<label htmlFor="tipo_sanguineo">Tipo Sanguíneo</label>
									<select
										id="tipo_sanguineo"
										value={tipo_sanguineo}
										onChange={(e) => setTipoSanguineo(e.target.value)}
									>
										<option value="">Selecione</option>
										{tipoSanguineoOptions.map(tipo => (
											<option key={tipo} value={tipo}>{tipo}</option>
										))}
									</select>
								</div>
							</div>

							<div className={styles.formGroup}>
								<label htmlFor="contato_emergencia">Contato de Emergência</label>
								<input
									type="text"
									id="contato_emergencia"
									value={contato_emergencia}
									onChange={(e) => setContatoEmergencia(e.target.value)}
									placeholder="Nome e telefone"
								/>
							</div>
						</>
					)}

					{/* Seção de Permissões */}
					<details className={styles.permissionsSection} open>
						<summary className={styles.permissionsSummary}>Permissões do Usuário</summary>

						<div className={styles.permissionsGrid}>
							<div className={styles.permissionItem}>
								<label>
									<input
										type="checkbox"
										checked={permissoes.dashboard}
										onChange={() => handlePermissaoChange('dashboard')}
									/>
									Visualizar Dashboard
								</label>
							</div>

							<div className={styles.permissionItem}>
								<label>
									<input
										type="checkbox"
										checked={permissoes.criar_usuario}
										onChange={() => handlePermissaoChange('criar_usuario')}
									/>
									Criar Usuários
								</label>
							</div>

							<div className={styles.permissionItem}>
								<label>
									<input
										type="checkbox"
										checked={permissoes.editar_usuario}
										onChange={() => handlePermissaoChange('editar_usuario')}
									/>
									Editar Usuários
								</label>
							</div>

							<div className={styles.permissionItem}>
								<label>
									<input
										type="checkbox"
										checked={permissoes.visualizar_prontuarios}
										onChange={() => handlePermissaoChange('visualizar_prontuarios')}
									/>
									Visualizar Prontuários
								</label>
							</div>

							<div className={styles.permissionItem}>
								<label>
									<input
										type="checkbox"
										checked={permissoes.criar_prontuarios}
										onChange={() => handlePermissaoChange('criar_prontuarios')}
									/>
									Criar Prontuários
								</label>
							</div>

							<div className={styles.permissionItem}>
								<label>
									<input
										type="checkbox"
										checked={permissoes.agendar_consultas}
										onChange={() => handlePermissaoChange('agendar_consultas')}
									/>
									Agendar Consultas
								</label>
							</div>

							<div className={styles.permissionItem}>
								<label>
									<input
										type="checkbox"
										checked={permissoes.relatorios}
										onChange={() => handlePermissaoChange('relatorios')}
									/>
									Gerar Relatórios
								</label>
							</div>

							<div className={styles.permissionItem}>
								<label>
									<input
										type="checkbox"
										checked={permissoes.configuracoes}
										onChange={() => handlePermissaoChange('configuracoes')}
									/>
									Acessar Configurações
								</label>
							</div>
						</div>
					</details>

					<div className={styles.formActions}>
						<button
							type="button"
							onClick={handleCancel}
							className={styles.cancelButton}
							disabled={saving}
						>
							Cancelar
						</button>

						<button
							type="submit"
							className={styles.submitButton}
							disabled={saving}
						>
							{saving ? "Salvando..." : (isEditing ? "Atualizar" : "Criar")}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default UserControllCreate;