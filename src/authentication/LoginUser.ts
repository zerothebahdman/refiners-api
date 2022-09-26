import { NextFunction, Request, Response } from 'express';
import AppException from '../exceptions/AppException';
import httpStatus from 'http-status';
import AuthService from '../services/Auth.service';

export default class LoginUser {
  constructor(private readonly authService: AuthService) {}
  async _loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const token = await this.authService.loginUser(req.body, next);
      res.status(httpStatus.OK).json({
        status: 'success',
        message: 'Login successful',
        token,
      });
    } catch (err: any) {
      return next(new AppException(err.message, err.status));
    }
  }
}
