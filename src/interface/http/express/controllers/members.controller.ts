import { NextFunction, Request, Response } from 'express';
import MembersService from '../../../../services/Members.service';
import AppException from '../../../../exceptions/AppException';
import { RequestType } from '../middlewares/auth.middleware';

export default class MembersController {
  constructor(private readonly membersService: MembersService) {}
  async getAllMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const { members, page } = await this.membersService.getAllMembers(
        req.query
      );
      return res.status(200).json({
        status: 'success',
        totalNumberOfMembers: members.length,
        page,
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
      const { accountDetails, page, limit, skip } =
        await this.membersService.getAccountTotalDetails(req.query);
      return res.status(200).json({
        status: 'success',
        totalNumberOfMembers: accountDetails.length,
        page,
        limit,
        skip,
        accountDetails,
      });
    } catch (err: any) {
      return next(new AppException(err.message, err.status));
    }
  }
}
