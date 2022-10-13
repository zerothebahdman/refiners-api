import { Router } from 'express';
import { isUserAuthenticated } from '../../middlewares/auth.middleware';
import { newsController } from '../../controllers/controllers.module';
import {
  CreateNews,
  updateNews,
} from '../../../../../validators/NewsValidator';
import validate from '../../middlewares/validate';
import { restrictAccessTo } from '../../middlewares/role.middleware';

const router = Router();

router
  .route('/')
  .get(isUserAuthenticated, (req, res, next) => {
    newsController.getAllNews(req, res, next);
  })
  .post(
    isUserAuthenticated,
    restrictAccessTo('super_admin'),
    validate(CreateNews),
    (req, res, next) => [newsController.createNews(req, res, next)]
  );

router
  .route('/:newsId')
  .patch(
    isUserAuthenticated,
    restrictAccessTo('super_admin'),
    validate(updateNews),
    (req, res, next) => {
      newsController.updateNews(req, res, next);
    }
  )
  .delete(
    isUserAuthenticated,
    restrictAccessTo('super_admin'),
    validate(updateNews),
    (req, res, next) => {
      newsController.deleteNews(req, res, next);
    }
  );

export default router;
