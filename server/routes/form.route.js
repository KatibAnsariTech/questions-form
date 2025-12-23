import express from 'express';
import { createForm, getFormsByUser } from '../controllers/form.controller.js';

const formRoute = express.Router();

formRoute.post("/form", createForm);
formRoute.get("/forms/user/:userId", getFormsByUser);

export default formRoute;