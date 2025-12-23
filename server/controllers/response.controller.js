import Response from "../models/response.model.js";

/**
 * Submit response
 */
export const submitResponse = async (req, res) => {
  try {
    const response = await Response.create(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get responses by form
 */
export const getResponsesByForm = async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId });
    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
