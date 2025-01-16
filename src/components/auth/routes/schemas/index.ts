import Joi from 'joi';
const email = Joi.string()
  .label('email')
  .trim()
  .empty()
  .lowercase()
  .email({ minDomainSegments: 2 })
  .required()
  .messages({
    'string.required': 'Email is required',
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email cannot be empty',
  });

const token = Joi.string().label('token').trim().empty().required().messages({
  'string.empty': 'Required',
});

const password = Joi.string()
  .min(8)
  .max(70)
  .empty()
  .label('password')
  .trim()
  .regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,30}$/)
  .required()
  .messages({
    'string.required': 'Password is required',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password should have a minimum length of 8 characters',
    'string.max': 'Password should have a maximum length of 70 characters',
    'string.regex':
      'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    'string.pattern.base':
      'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
  });
const role = Joi.string().required().messages({
  'string.required': 'Password is required',
});
const name = Joi.string().optional();

export default {
  token: Joi.object().keys({ token }),
  signUp: Joi.object().keys({
    email,
    role,
    password,
    name,
  }),

  login: Joi.object().keys({
    email,
    password,
  }),

  forgotPassword: Joi.object().keys({
    email,
  }),
  resetPassword: Joi.object().keys({
    password,
    token,
  }),
};
