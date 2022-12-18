import { NextFunction, Request, Response } from 'express';
import MembersService from '../../../../services/Members.service';
import AppException from '../../../../exceptions/AppException';
import { RequestType } from '../middlewares/auth.middleware';
import pick from '../../../../utils/pick';

export default class MembersController {
  constructor(private readonly membersService: MembersService) {}
  async getAllMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const filter = pick(req.query, ['role']);
      const options = pick(req.query, ['sortBy', 'page', 'limit']);
      const members = await this.membersService.getAllMembers(
        filter,
        options,
        !!req.query.ignorePagination
      );
      return res.status(200).json({
        status: 'success',
        members,
      });
    } catch (err: any) {
      return next(new AppException(err.message, err.status));
    }
  }

  async updateMember(req: RequestType, res: Response, next: NextFunction) {
    try {
      const user = await this.membersService.updateMemberById(
        req.user.id,
        req.body
      );

      return res.status(200).json({ status: 'record updated', user });
    } catch (err: any) {
      return next(new AppException(err.message, err.status));
    }
  }

  async deleteMemberAccount(req: Request, res: Response, next: NextFunction) {
    try {
      await this.membersService.deleteMember(req.params.memberId);
      res.status(204).send();
    } catch (err: any) {
      return next(new AppException(err.message, err.status));
    }
  }

  async getMemberAccountSummaries(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const summary = await this.membersService.getMembersAccountSummaries();
      return res.status(200).json({
        status: 'success',
        summary,
      });
    } catch (err: any) {
      return next(new AppException(err.message, err.status));
    }
  }
  async getAccountTotalDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const filter = pick(req.query, ['account']);
      const options = pick(req.query, ['sortBy', 'page', 'limit', 'populate']);
      const accountDetails = await this.membersService.getAccountTotalDetails(
        filter,
        options
      );
      return res.status(200).json({
        status: 'success',
        accountDetails,
      });
    } catch (err: any) {
      return next(new AppException(err.message, err.status));
    }
  }

  async getMemberForMembers(
    req: RequestType,
    res: Response,
    next: NextFunction
  ) {
    try {
      const member = await this.membersService.getMemberForMembers(req.user.id);
      return res.status(200).json({
        status: 'success',
        member,
      });
    } catch (err: any) {
      return next(new AppException(err.message, err.status));
    }
  }
}
