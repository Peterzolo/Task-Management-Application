import Joi from 'joi';

const title = Joi.string().required().messages({
  'string.required': 'Title is required',
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
