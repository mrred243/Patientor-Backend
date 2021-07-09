import express from 'express';
import patientServices from '../services/patientServices';

import { toNewPatientEntry, toNewEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
	res.send(patientServices.getAllNoneSensitive());
});

router.get('/:id', (req, res) => {
	const entry = patientServices.getOneById(String(req.params.id));
	if (entry) {
		res.send(entry);
	} else {
		res.status(404).send('Invalid or missing patient id');
	}
});

router.post('/', (req, res) => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const newPatientEntry = toNewPatientEntry(req.body);
		const addEntry = patientServices.addPatient(newPatientEntry);
		res.json(addEntry);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

router.post('/:id/entries', (req, res) => {
	try {
		const patient = patientServices.getOneById(req.params.id);

		const newEntry = toNewEntry(req.body);

		if (patient && newEntry) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const updatedPatient = patientServices.addEntry(patient, newEntry);

			res.json(updatedPatient);
		}
	} catch (e) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		res.status(400).send(e.message);
	}
});

export default router;
