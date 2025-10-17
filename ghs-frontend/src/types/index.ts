// Enums
export enum UserProfile {
  VALIDATOR = 'Validator',
  SUPERVISOR = 'Supervisor',
  ADMINISTRATOR = 'Administrator',
  COORDINATOR = 'Coordinator',
}

export enum ContractType {
  CDI = 'CDI',
  CDD = 'CDD',
  INTERIM = 'Interim',
  STAGE = 'Stage',
  ALTERNANCE = 'Alternance',
  MOO = 'MOO',
}

export enum RequestStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  FIRST_LEVEL_APPROVED = 'firstLevelApproved',
  IN_PROGRESS = 'inProgress',
  SECOND_LEVEL_APPROVED = 'secondLevelApproved',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

// Base Interfaces
export interface User {
  accountID: number;
  employeeID: number;
  username: string;
  profile: UserProfile;
  isActive: boolean;
  lastLogin?: Date;
  employee: Employee;
}

export interface Employee {
  employeeID: number;
  employeeNumber: string;
  lastName: string;
  firstName: string;
  fullName?: string;
  serviceID: number;
  service?: Service;
  contractType: ContractType;
  contact?: string;
  birthdate?: Date;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  serviceID: number;
  serviceCode: string;
  serviceName: string;
  parentServiceID?: number;
  parentService?: Service;
  description?: string;
  manager?: string;
  children?: Service[];
  employeesCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Request {
  requestID: number;
  employeeID: number;
  employee?: Employee;
  requestDate: Date;
  previousStart?: string;
  previousEnd?: string;
  startAt: string;
  endAt: string;
  status: RequestStatus;
  comment?: string;
  createdBy?: number;
  creator?: Employee;
  validatedN1At?: Date;
  validatedN2At?: Date;
  workflows?: Workflow[];
  duration?: number;
  extraHours?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Delegation {
  delegationID: number;
  delegatedBy: number;
  delegatedByEmployee?: Employee;
  delegatedTo: number;
  delegatedToEmployee?: Employee;
  startAt: Date;
  endAt: Date;
  isActive?: boolean;
}

export interface Workflow {
  workflowID: number;
  requestID: number;
  request?: Request;
  validator: number;
  validatorEmployee?: Employee;
  delegate?: number;
  delegateEmployee?: Employee;
  assignDate: Date;
  validationDate?: Date;
  status: number;
  comment?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;