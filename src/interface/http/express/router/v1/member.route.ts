import { Router, Request, Response, NextFunction } from 'express';
import { isUserAuthenticated } from '../../middlewares/auth.middleware';
import { membersController } from '../../controllers/controllers.module';
import { restrictAccessTo } from '../../middlewares/role.middleware';

const router = Router();

router
  .route('/')
  .get(
    isUserAuthenticated,
    restrictAccessTo('super_admin'),
    (req: Request, res: Response, next: NextFunction) => {
      membersController.getAllMembers(req, res, next);
    }
  );

router
  .route('/:memberId')
  .patch(
    isUserAuthenticated,
    restrictAccessTo('super_admin', 'member'),
    (req, res, next) => {
      membersController.updateMember(req, res, next);
    }
  )
  .delete(
    isUserAuthenticated,
    restrictAccessTo('super_admin'),
    (req, res, next) => {
      membersController.deleteMemberAccount(req, res, next);
    }
  );

router.get(
  '/member-account-summaries',
  isUserAuthenticated,
  restrictAccessTo('super_admin'),
  (req, res, next) => {
    membersController.getMemberAccountSummaries(req, res, next);
  }
);

router.get(
  '/account-total/details',
  isUserAuthenticated,
  restrictAccessTo('super_admin'),
  (req, res, next) => {
    membersController.getAccountTotalDetails(req, res, next);
  }
);

router.get(
  '/get-member',
  isUserAuthenticated,
  restrictAccessTo('member'),
  (req, res, next) => {
    membersController.getMemberForMembers(req, res, next);
  }
);

export default router;
