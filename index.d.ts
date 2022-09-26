export interface UserInterface {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  id: string;
  _id: string;
  occupation: string;
  avatar: Object<{ image: string; meta: Object }>;
  businessAddress: string;
  gender: string;
  address: string;
  role: string;
  permissions: string[];
  email_verification_token: string;
  isEmailVerified: boolean;
  password_updated_at: Date;
  password_reset_token: string;
  password_reset_token_expires_at: Date;
  email_verified_at: Date;
  email_verification_token_expires_at: Moment;
  active: boolean;
  tokens: { token: string; expiresIn: Date; tokenType: string };
  school: SchoolInterface;
  billing: Object<{
    plan: string;
    cycle: Object<{ startDate: Date; endDate: Date }>;
    cycleId: string;
    status: string;
    renew: boolean;
    switchPlan: boolean;
    paymentCustomerId: string;
  }>;
}
