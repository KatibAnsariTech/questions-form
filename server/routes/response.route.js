import express from 'express';
import { submitResponse } from '../controllers/response.controller.js';

const resRoute = express.Router();

resRoute.post('/response' , submitResponse);

export default resRoute;