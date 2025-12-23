import express from 'express';
import { submitResponse, getResponsesByForm } from '../controllers/response.controller.js';

const resRoute = express.Router();

// Public route - anyone can submit a response
resRoute.post('/response', submitResponse);

// Protected route - only form owner can view responses
resRoute.get('/form/:formId', getResponsesByForm);

export default resRoute;
