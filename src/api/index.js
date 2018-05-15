import { Router } from 'express';
import config from '../config';
import { version } from '../../package.json';

export default ({ config, db }) => {
	let api = Router();

	api.get('/sites', (req, res) => {
		res.json(config.sites);
	});

	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
