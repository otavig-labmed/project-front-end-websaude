import { z } from 'zod';

// Schema para login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .max(255, 'Email muito longo'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(128, 'Senha muito longa')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'
    )
});

// Schema para criação de usuário
export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .max(255, 'Email muito longo'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(128, 'Senha muito longa')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),
  role: z
    .string()
    .min(1, 'Perfil é obrigatório')
    .refine((val) => ['admin', 'user', 'doctor'].includes(val), {
      message: 'Perfil inválido'
    })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
});

// Schema para criação de paciente
export const createPatientSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .max(255, 'Email muito longo'),
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone deve estar no formato (99) 99999-9999'),
  cpf: z
    .string()
    .min(1, 'CPF é obrigatório')
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 999.999.999-99')
    .refine((cpf) => {
      // Validação de CPF
      const cleanCpf = cpf.replace(/\D/g, '');
      if (cleanCpf.length !== 11) return false;
      
      // Verificar se todos os dígitos são iguais
      if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
      
      // Validar dígitos verificadores
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
      }
      let remainder = 11 - (sum % 11);
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cleanCpf.charAt(9))) return false;
      
      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
      }
      remainder = 11 - (sum % 11);
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cleanCpf.charAt(10))) return false;
      
      return true;
    }, 'CPF inválido'),
  birthDate: z
    .string()
    .min(1, 'Data de nascimento é obrigatória')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 0 && age <= 120;
    }, 'Data de nascimento inválida'),
  address: z.object({
    street: z.string().min(1, 'Rua é obrigatória').max(200, 'Rua muito longa'),
    number: z.string().min(1, 'Número é obrigatório').max(10, 'Número muito longo'),
    complement: z.string().max(100, 'Complemento muito longo').optional(),
    neighborhood: z.string().min(1, 'Bairro é obrigatório').max(100, 'Bairro muito longo'),
    city: z.string().min(1, 'Cidade é obrigatória').max(100, 'Cidade muito longa'),
    state: z.string().min(1, 'Estado é obrigatório').max(2, 'Estado deve ter 2 caracteres'),
    zipCode: z
      .string()
      .min(1, 'CEP é obrigatório')
      .regex(/^\d{5}-\d{3}$/, 'CEP deve estar no formato 99999-999')
  })
});

// Schema para criação de consulta
export const createAppointmentSchema = z.object({
  patientId: z
    .string()
    .min(1, 'Paciente é obrigatório'),
  doctorId: z
    .string()
    .min(1, 'Médico é obrigatório'),
  date: z
    .string()
    .min(1, 'Data é obrigatória')
    .refine((date) => {
      const appointmentDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return appointmentDate >= today;
    }, 'Data deve ser futura'),
  time: z
    .string()
    .min(1, 'Horário é obrigatório')
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário deve estar no formato HH:MM'),
  duration: z
    .number()
    .min(15, 'Duração mínima é 15 minutos')
    .max(240, 'Duração máxima é 4 horas'),
  type: z
    .string()
    .min(1, 'Tipo de consulta é obrigatório')
    .refine((val) => ['consulta', 'retorno', 'emergencia'].includes(val), {
      message: 'Tipo de consulta inválido'
    }),
  notes: z
    .string()
    .max(500, 'Observações muito longas')
    .optional()
});

// Schema para busca/filtros
export const searchSchema = z.object({
  query: z
    .string()
    .max(100, 'Busca muito longa')
    .optional(),
  page: z
    .number()
    .min(1, 'Página deve ser maior que 0')
    .optional(),
  limit: z
    .number()
    .min(1, 'Limite deve ser maior que 0')
    .max(100, 'Limite máximo é 100')
    .optional(),
  sortBy: z
    .string()
    .optional(),
  sortOrder: z
    .enum(['asc', 'desc'])
    .optional()
});

// Função para formatar mensagens de erro
export const formatValidationError = (error) => {
  if (error && error.errors && error.errors.length > 0) {
    return error.errors.map(err => err.message).join(', ');
  }
  return 'Erro de validação';
};

// Função para validar CPF
export const validateCPF = (cpf) => {
  const cleanCpf = cpf.replace(/\D/g, '');
  if (cleanCpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.charAt(10))) return false;
  
  return true;
};

// Função para validar telefone
export const validatePhone = (phone) => {
  const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
  return phoneRegex.test(phone);
};

// Função para validar CEP
export const validateZipCode = (zipCode) => {
  const zipCodeRegex = /^\d{5}-\d{3}$/;
  return zipCodeRegex.test(zipCode);
}; 