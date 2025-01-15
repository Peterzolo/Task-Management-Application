export {};

declare global {
  namespace Express {
    export interface Request {
      user: string;
      accessToken: string;
      authId: string;
      email: string;
      partnerId: string;
      businessId: string;
      employeeId: string;
    }
  }
}
