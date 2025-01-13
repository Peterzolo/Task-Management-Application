export enum EmailTemplate {
  SIGNUP = 'SIGNUP',
  SIGNUP_EMAIL_VERIFICATION = 'SIGNUP_EMAIL_VERIFICATION',
  SIGNUP_CUSTOMER_EMAIL_VERIFICATION = 'SIGNUP_CUSTOMER_EMAIL_VERIFICATION',
  SUCCESSFUL_SIGNUP = 'SUCCESSFUL_SIGNUP',
  PASSWORD_RESET_EMAIL = 'PASSWORD_RESET_EMAIL',
  BACKOFFICE_PASSWORD_RESET_EMAIL = 'BACKOFFICE_PASSWORD_RESET_EMAIL',
  SUCCESSFUL_PASSWORD_RESET = 'SUCCESSFUL_PASSWORD_RESET',
  INVOICE_TEMPLATE = 'INVOICE_TEMPLATE',
  RECEIPT_TEMPLATE = 'RECEIPT_TEMPLATE',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  PAYMENT_RECEIPT = 'PAYMENT_RECEIPT',
  PAYMENT_SUCCESSFUL = 'PAYMENT_SUCCESSFUL',
}

export type EmailTemplateType = keyof typeof EmailTemplate;