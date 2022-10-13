import News from '../database/models/news.model';
import { NewsInterface } from '../../index';

export default class NewsService {
  constructor(private readonly newsRepository: typeof News) {}
  async getAllNews() {
    return await this.newsRepository.find();
  }
  async getNewsById(id: string) {
    return await this.newsRepository.findById(id);
  }
  async createNews(news: NewsInterface) {
    return await this.newsRepository.create(news);
  }
  async updateNewsById(id: string, news: NewsInterface) {
    return await this.newsRepository.findByIdAndUpdate(id, news, { new: true });
  }
  async deleteNewsById(id: string) {
    return await this.newsRepository.findByIdAndDelete(id);
  }
}
