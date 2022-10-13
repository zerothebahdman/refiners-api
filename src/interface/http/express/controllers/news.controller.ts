import NewsService from '../../../../services/News.service';
import AppException from '../../../../exceptions/AppException';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import moment from 'moment';

export default class NewsController {
  constructor(private readonly newsService: NewsService) {}
  async getAllNews(_req: Request, res: Response, next: NextFunction) {
    try {
      const news = await this.newsService.getAllNews();
      res.status(httpStatus.OK).json({ news });
    } catch (err: any) {
      return next(new AppException(err.message, err.status));
    }
  }
  async createNews(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.date = moment().utc().toDate();
      const news = await this.newsService.createNews(req.body);
      res.status(httpStatus.CREATED).json({ news });
    } catch (err: any) {
      return next(new AppException(err.message, err.status));
    }
  }
  async deleteNews(req: Request, res: Response, next: NextFunction) {
    try {
      await this.newsService.deleteNewsById(req.params.newsId);
      return res.status(httpStatus.NO_CONTENT).send();
    } catch (err: any) {
      return next(new AppException(err.message, err.status));
    }
  }
  async updateNews(req: Request, res: Response, next: NextFunction) {
    try {
      const news = await this.newsService.updateNewsById(
        req.params.newsId,
        req.body
      );
      res.status(httpStatus.OK).json({ news });
    } catch (err: any) {
      return next(new AppException(err.message, err.status));
    }
  }
}
