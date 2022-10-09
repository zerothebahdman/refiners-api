import { Schema, model } from 'mongoose';
import { UserInterface } from '../../../index';
import { ROLES } from '../../utils/constants';

const UserSchema = new Schema<UserInterface>(
  {
    firstName: {
      type: String,
      required: [true, 'Oops! you need to specify a name'],
      lowercase: true,
    },
    lastName: {
      type: String,
      required: [true, 'Oops! you need to specify a name'],
      lowercase: true,
    },
    username: String,
    email: { type: String, required: true, unique: true, lowercase: true },
    phoneNumber: {
      type: String,
      required: [true, 'Oops! you need to specify a phoneNumber'],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [
        8,
        `Oops! your password needs to be at least 8 characters long`,
      ],
      select: false,
    },
    // avatar: {
    //   image: { type: String },
    //   meta: Object,
    // },
    gender: { type: String, enum: ['male', 'female'], required: true },
    address: String,
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
    occupation: String,
    // isEmailVerified: { type: Boolean, default: false },
    password_updated_at: Date,
    password_reset_token: String,
    password_reset_token_expires_at: Date,
    // email_verified_at: Date,
    // email_verification_token: String,
    // email_verification_token_expires_at: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        delete ret._id;
        delete ret.active;
        delete ret.email_verification_token;
        delete ret.email_verified_at;
        delete ret.email_verification_token_expires_at;
        delete ret.password_reset_token;
        delete ret.password_reset_token_expires_at;
        delete ret.__v;
        delete ret.password;
        delete ret.password_reset;
        // delete ret.avatar.meta;
        return ret;
      },
    },
    timestamps: true,
    toObject: { virtuals: true },
  }
);

const User = model<UserInterface>('User', UserSchema);
export default User;
