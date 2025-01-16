import Joi from 'joi';

const title = Joi.string().min(3).max(100).required().messages({
  'string.required': 'Title is required',
  'string.min': 'Title must be at least 3 characters long',
  'string.max': 'Title must be at most 100 characters long',
});

const description = Joi.string().required().messages({
  'string.required': 'Description is required',
});

const dueDate = Joi.string().optional();

export default {
  createTask: Joi.object().keys({
    title,
    description,
    dueDate,
  }),
};
