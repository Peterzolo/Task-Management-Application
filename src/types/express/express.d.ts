export {};

declare global {
  namespace Express {
    export interface Request {
      userId: string;
      accessToken: string;
      authId: string;
      email: string;
      partnerId: string;
      businessId: string;
      employeeId: string;
    }
  }
}
