import { Request, Response, NextFunction } from 'express';
import AppException from '../exceptions/AppException';

import log from '../logging/logger';
import EmailService from '../services/Email.service';
import User from '../database/models/user.model';
import AuthService from '../services/Auth.service';
import httpStatus from 'http-status';
const emailService = new EmailService();

export default class CreateUser {
  constructor(private readonly authService: AuthService) {}
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const _userNameExists = await User.findOne({
        username: req.body.username,
      });

      if (_userNameExists)
        return next(
          new AppException(
            `Oops!, ${_userNameExists.username} is taken`,
            httpStatus.UNPROCESSABLE_ENTITY
          )
        );
      /** if user does not exist create the user using the user service */
      const { _user } = await this.authService.createUser(req.body);

      /** Send email verification to user */
      await emailService._sendUserLoginCredentials(
        _user.firstName,
        _user.email,
        _user.username
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
