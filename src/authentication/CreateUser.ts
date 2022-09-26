import { Request, Response, NextFunction } from 'express';
import AppException from '../exceptions/AppException';

import log from '../logging/logger';
import EmailService from '../services/Email.service';
import User from '../database/models/user.model';
import AuthService from '../services/Auth.service';
const emailService = new EmailService();

export default class CreateUser {
  constructor(private readonly authService: AuthService) {}
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const _userExists = await User.findOne({ email: req.body.email });

      if (_userExists)
        return next(
          new AppException(`Oops!, ${_userExists.email} is taken`, 422)
        );

      /** if user does not exist create the user using the user service */
      const { _user, OTP_CODE } = await this.authService.createUser(req.body);

      /** Send email verification to user */
      await emailService._sendUserEmailVerificationEmail(
        _user.firstName,
        _user.email,
        OTP_CODE
      );

      res.status(200).json({
        status: 'success',
        message: `We've sent an verification email to your mail`,
        user: _user,
      });
    } catch (err: any) {
      log.error(err);
      return next(new AppException(err.message, err.status));
    }
  }
}
