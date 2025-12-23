import express from 'express';
import {
    createForm,
    getFormsByUser,
    getFormById,
    updateForm,
    deleteForm
} from '../controllers/form.controller.js';

const formRoute = express.Router();

formRoute.post("/form", createForm);
formRoute.get("/forms/user/:userId", getFormsByUser);
formRoute.get("/:id", getFormById);
formRoute.put("/:id", updateForm);
formRoute.delete("/:id", deleteForm);

export default formRoute;
