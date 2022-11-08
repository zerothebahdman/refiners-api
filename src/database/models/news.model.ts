import { Schema, model } from 'mongoose';
import { NewsInterface } from '../../../index';
import paginate from '../plugins/paginate.plugin';

const NewsSchema = new Schema<NewsInterface>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    date: Date,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        delete ret._id;
        return ret;
      },
    },
  }
);

NewsSchema.plugin(paginate);
const News = model<NewsInterface>('News', NewsSchema);
export default News;
