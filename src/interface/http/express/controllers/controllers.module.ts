/**
 * Use this module file to create instances of all controllers and simplify imports in to your routers
 */

import UserController from './users.controller';
import MembersController from './members.controller';
import MembersService from '../../../../services/Members.service';
import User from '../../../../database/models/user.model';
import TransactionController from './transaction.controller';
import TransactionService from '../../../../services/Transaction.service';
import Transaction from '../../../../database/models/transaction.model';
import Account from '../../../../database/models/Accounts.model';

export const userController = new UserController();
export const membersController = new MembersController(
  new MembersService(User, Account)
);
export const transactionController = new TransactionController(
  new TransactionService(Transaction),
  new MembersService(User, Account)
);
