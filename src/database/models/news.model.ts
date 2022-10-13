import { Schema, model } from 'mongoose';
import { NewsInterface } from '../../../index';

const NewsSchema = new Schema<NewsInterface>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: Date,
});

const News = model<NewsInterface>('News', NewsSchema);
export default News;
