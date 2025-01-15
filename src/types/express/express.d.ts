export {};

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
      accessToken: string;
      authId: string;
      email: string;
      partnerId: string;
      businessId: string;
      employeeId: string;
    }
  }
}
