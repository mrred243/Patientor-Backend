import diagnoseData from '../../data/diagnoses.json';

import { Diagnosis } from '../types';

const diagnoses: Array<Diagnosis> = diagnoseData;

const getAll = (): Array<Diagnosis> => {
	return diagnoses;
};

export default {
	getAll,
};
