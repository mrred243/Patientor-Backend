export enum Gender {
	Male = 'male',
	Female = 'female',
	Other = 'other',
}

export enum EntryType {
	Hospital = 'Hospital',
	HealthCheck = 'HealthCheck',
	OccupationalHealthcare = 'OccupationalHealthcare',
}

export interface Diagnosis {
	code: string;
	name: string;
	latin?: string;
}

export interface Discharge {
	date: string;
	criteria: string;
}

export interface SickLeave {
	startDate: string;
	endDate: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type Entry =
	| HospitalEntry
	| OccupationalHealthcareEntry
	| HealthCheckEntry;

interface BaseEntry {
	id: string;
	description: string;
	date: string;
	specialist: string;
	diagnosisCodes?: Array<Diagnosis['code']>;
}

export enum HealthCheckRating {
	'Healthy' = 0,
	'LowRisk' = 1,
	'HighRisk' = 2,
	'CriticalRisk' = 3,
}

interface HealthCheckEntry extends BaseEntry {
	type: EntryType.HealthCheck;
	healthCheckRating: HealthCheckRating;
}

interface OccupationalHealthcareEntry extends BaseEntry {
	type: EntryType.OccupationalHealthcare;
	employerName: string;
	sickLeave?: SickLeave;
}

interface HospitalEntry extends BaseEntry {
	type: EntryType.Hospital;
	discharge?: Discharge;
}

export interface PatientEntry {
	id: string;
	name: string;
	dateOfBirth: string;
	gender: Gender;
	occupation: string;
	ssn: string;
	entries: Entry[];
}

export type NoneSensitivePatientEntry = Omit<PatientEntry, 'ssn'>;

export type NewPatientEntry = Omit<PatientEntry, 'id'>;

export type PublicPatient = Omit<PatientEntry, 'ssn' | 'entries'>;

export type NewEntry =
	| Omit<HospitalEntry, 'id'>
	| Omit<OccupationalHealthcareEntry, 'id'>
	| Omit<HealthCheckEntry, 'id'>;

export type NewBaseEntry = Omit<BaseEntry, 'id'>;
