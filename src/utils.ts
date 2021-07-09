import {
	Gender,
	Entry,
	HealthCheckRating,
	Diagnosis,
	SickLeave,
	Discharge,
	NewEntry,
	NewBaseEntry,
	EntryType,
} from './types';
import { NewPatientEntry } from '../src/types';

// type guards
const assertNever = (value: never): never => {
	throw new Error(
		`Unhandled discriminated union member: ${JSON.stringify(value)}`,
	);
};

const isString = (text: unknown): text is string => {
	return typeof text === 'string' || text instanceof String;
};

const isDate = (data: string): boolean => {
	return Boolean(Date.parse(data));
};

const isGender = (param: any): param is Gender => {
	return Object.values(Gender).includes(param);
};

const isEntryType = (param: any): param is EntryType => {
	return Object.values(EntryType).includes(param);
};

const isDischarge = (discharge: any): boolean => {
	return Boolean(
		discharge.date &&
			discharge.criteria &&
			isDate(discharge.date) &&
			isString(discharge.criteria),
	);
};

const isSickLeave = (sickLeave: any): boolean => {
	return Boolean(
		sickLeave.startDate &&
			sickLeave.endDate &&
			isDate(sickLeave.startDate) &&
			isDate(sickLeave.endDate),
	);
};

const isHealthCheckRating = (healthCheckRating: any): boolean => {
	return Object.values(HealthCheckRating).includes(healthCheckRating);
};

// parse fields

const parseName = (name: unknown): string => {
	if (!name || !isString(name)) {
		throw new Error('Incorrect or missing name');
	}
	return name;
};

const parseDate = (date: unknown): string => {
	if (!date || !isString(date) || !isDate(date)) {
		throw new Error('Invalid or missing date');
	}
	return date;
};

const parseOccupation = (occupation: unknown): string => {
	if (!occupation || !isString(occupation)) {
		throw new Error('Invalid or missing occupation');
	}
	return occupation;
};

const parseGender = (gender: unknown): Gender => {
	if (!gender || !isGender(gender)) {
		throw new Error('Invalid or missing gender');
	}
	return gender;
};

const parseSsn = (ssn: unknown): string => {
	if (!ssn || !isString(ssn)) {
		throw new Error('Invalid or missing ssn');
	}
	return ssn;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseEntries = (entries: any): Entry[] => {
	if (!entries) {
		return [];
	}
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return entries;
};

type Fields = {
	name: unknown;
	dateOfBirth: unknown;
	gender: unknown;
	occupation: unknown;
	ssn: unknown;
	entries: unknown;
};

export const toNewPatientEntry = ({
	name,
	dateOfBirth,
	occupation,
	gender,
	ssn,
	entries,
}: Fields): NewPatientEntry => {
	const newEntry: NewPatientEntry = {
		name: parseName(name),
		dateOfBirth: parseDate(dateOfBirth),
		occupation: parseOccupation(occupation),
		gender: parseGender(gender),
		ssn: parseSsn(ssn),
		entries: parseEntries(entries),
	};

	return newEntry;
};

// Parse entry's properties

const parseEntryType = (type: unknown): EntryType => {
	if (!type || !isEntryType(type)) {
		throw new Error('Invalid or missing entry type.');
	}
	return type;
};

const parseString = (value: unknown, type: string): string => {
	if (!value || !isString(value)) {
		throw new Error(`Invalid or missing entry ${type}.`);
	}
	return value;
};

const parseDiagnosisCodes = (codes: unknown): Array<Diagnosis['code']> => {
	if (!Array.isArray(codes) || !codes.every((code) => isString(code))) {
		throw new Error(`Invalid diagnosis codes`);
	}
	return codes as Array<Diagnosis['code']>;
};

const parseDischarge = (discharge: any): Discharge => {
	if (!discharge || !isDischarge(discharge)) {
		throw new Error(`Invalid or missing discharge field`);
	}

	return discharge as Discharge;
};

const parseSickLeave = (sickLeave: any): SickLeave => {
	if (!sickLeave || !isSickLeave(sickLeave)) {
		throw new Error(`Invalid or missing sick leave field`);
	}

	return sickLeave as SickLeave;
};

const parseHealthCheckRating = (healthCheckRating: any): HealthCheckRating => {
	if (
		healthCheckRating === undefined ||
		!isHealthCheckRating(healthCheckRating)
	) {
		throw new Error(`Invalid or missing healthcheck rating field`);
	}

	return healthCheckRating as HealthCheckRating;
};

export const toNewEntry = (object: any): NewEntry => {
	// Set up base entry
	const newEntry = toNewBaseEntry(object) as NewEntry;

	// Get rest of the fields according to the appropriate entry type
	newEntry.type = parseEntryType(object.type);

	switch (newEntry.type) {
		case 'Hospital':
			newEntry.discharge = parseDischarge(object.discharge);
			return newEntry;

		case 'OccupationalHealthcare':
			newEntry.employerName = parseString(
				object.employerName,
				'employer name',
			);

			if (object.sickLeave) {
				newEntry.sickLeave = parseSickLeave(object.sickLeave);
			}
			return newEntry;

		case 'HealthCheck':
			newEntry.healthCheckRating = parseHealthCheckRating(
				object.healthCheckRating,
			);
			return newEntry;

		default:
			return assertNever(newEntry as never);
	}
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewBaseEntry = (object: any): NewBaseEntry => {
	const newBaseEntry: NewBaseEntry = {
		description: parseString(object.description, 'description'),
		date: parseDate(object.date),
		specialist: parseString(object.specialist, 'specialist'),
	};

	// Optional diagnosis codes field
	if (object.diagnosisCodes) {
		newBaseEntry.diagnosisCodes = parseDiagnosisCodes(
			object.diagnosisCodes,
		);
	}

	return newBaseEntry;
};
