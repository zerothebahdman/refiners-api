import { NextFunction, Request, Response } from 'express';
import AppException from '../../../../exceptions/AppException';
import TransactionService from '../../../../services/Transaction.service';
import { TRANSACTION_TYPE } from '../../../../utils/constants';
import MembersService from '../../../../services/Members.service';
import moment from 'moment';

export default class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly membersService: MembersService
  ) {}

  async creditMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { memberId } = req.params;
      req.body.user = memberId;
      req.body.transactionType = TRANSACTION_TYPE.CREDIT;
      req.body.date = moment().startOf('day').format('DD/MM/YYYY');

      const userAccount = await this.membersService.getMemberAccount(memberId);
      switch (req.body.account) {
        case 'thriftSavings':
          userAccount.accountInformation.thriftSavings += req.body.amount;
          break;
        case 'shareCapital':
          userAccount.accountInformation.shareCapital += req.body.amount;
          break;
        case 'commodityTrading':
          userAccount.accountInformation.commodityTrading += req.body.amount;
          break;
        case 'specialDeposit':
          userAccount.accountInformation.specialDeposit += req.body.amount;
          break;
        case 'fine':
          userAccount.accountInformation.fine += req.body.amount;
          break;
        case 'loan':
          userAccount.accountInformation.loan += req.body.amount;
          break;
        case 'projectFinancing':
          userAccount.accountInformation.projectFinancing += req.body.amount;
          break;
      }
      userAccount.balance += req.body.amount;
      userAccount.save();
      req.body.balance = userAccount.balance;
      const transaction = await this.transactionService.storeTransaction(
        req.body
      );
      return res.status(200).json({
        status: 'success',
        transaction,
      });
    } catch (err: any) {
      return next(new AppException(err.message, err.status));
    }
  }

  async debitMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const { memberId } = req.params;
      req.body.user = memberId;
      req.body.transactionType = TRANSACTION_TYPE.DEBIT;
      req.body.date = moment().startOf('day').format('DD/MM/YYYY');

      const userAccount = await this.membersService.getMemberAccount(memberId);
      switch (req.body.account) {
        case 'thriftSavings':
          userAccount.accountInformation.thriftSavings -= req.body.amount;
          break;
        case 'shareCapital':
          userAccount.accountInformation.shareCapital -= req.body.amount;
          break;
        case 'commodityTrading':
          userAccount.accountInformation.commodityTrading -= req.body.amount;
          break;
        case 'specialDeposit':
          userAccount.accountInformation.specialDeposit -= req.body.amount;
          break;
        case 'fine':
          userAccount.accountInformation.fine -= req.body.amount;
          break;
        case 'loan':
          userAccount.accountInformation.loan -= req.body.amount;
          break;
        case 'projectFinancing':
          userAccount.accountInformation.projectFinancing -= req.body.amount;
          break;
      }
      userAccount.balance -= req.body.amount;
      userAccount.save();
      req.body.balance = userAccount.balance;
      const transaction = await this.transactionService.storeTransaction(
        req.body
      );
      return res.status(200).json({
        status: 'success',
        transaction,
      });
    } catch (err: any) {
      return next(new AppException(err.message, err.status));
    }
  }

  async getMemberTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { transactions, page, limit, account, totalNumberOfTransactions } =
        await this.transactionService.getTransactionsByMember(req.query);
      return res.status(200).json({
        status: 'success',
        totalNumberOfTransactions,
        page,
        limit,
        account,
        transactions: transactions === undefined ? [] : transactions,
      });
    } catch (err: any) {
      return next(new AppException(err.message, err.status));
    }
  }
}
