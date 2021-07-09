import {
	NoneSensitivePatientEntry,
	NewPatientEntry,
	PatientEntry,
	Entry,
	NewEntry,
} from './../types';
import patientsData from '../../data/patients';

import { v1 } from 'uuid';

const getAllNoneSensitive = (): NoneSensitivePatientEntry[] => {
	return patientsData.map(
		({ id, name, dateOfBirth, occupation, gender, entries }) => ({
			id,
			name,
			dateOfBirth,
			occupation,
			gender,
			entries,
		}),
	);
};

const getOneById = (id: string): NoneSensitivePatientEntry | undefined => {
	const entry = patientsData.find((p) => p.id === id);
	return entry;
};

const addPatient = (patient: NewPatientEntry): PatientEntry => {
	const newPatient = {
		id: v1(),
		...patient,
	};

	patientsData.push(newPatient);
	return newPatient;
};

const addEntry = (
	patient: NoneSensitivePatientEntry,
	newEntry: NewEntry,
): NoneSensitivePatientEntry => {
	const id = v1();
	const entryToAdd: Entry = {
		...newEntry,
		id,
	};

	patient.entries.push(entryToAdd);
	return patient;
};

export default {
	getAllNoneSensitive,
	getOneById,
	addPatient,
	addEntry,
};
