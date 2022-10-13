import { Router } from 'express';
import { isUserAuthenticated } from '../../middlewares/auth.middleware';
import { restrictAccessTo } from '../../middlewares/role.middleware';
import { transactionController } from '../../controllers/controllers.module';
import { creditMember } from '../../../../../validators/TransactionValidator';
import validate from '../../middlewares/validate';

const router = Router();

router.get('/member-transactions', isUserAuthenticated, (req, res, next) => {
  transactionController.getMemberTransactions(req, res, next);
});

router.post(
  '/credit/:memberId',
  isUserAuthenticated,
  restrictAccessTo('super_admin'),
  validate(creditMember),
  (req, res, next) => {
    transactionController.creditMember(req, res, next);
  }
);

router.post(
  '/debit/:memberId',
  isUserAuthenticated,
  restrictAccessTo('super_admin'),
  validate(creditMember),
  (req, res, next) => {
    transactionController.debitMembers(req, res, next);
  }
);

export default router;
