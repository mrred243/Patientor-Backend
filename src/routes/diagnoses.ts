import express from 'express';
import diagnoseServices from '../services/diagnoseServices';

const diagnoseRouter = express.Router();

diagnoseRouter.get('/', (_req, res) => {
	res.send(diagnoseServices.getAll());
});

export default diagnoseRouter;
