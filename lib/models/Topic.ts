import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export interface ITopic extends Document {
  name: string;
  description: string;
  icon: string;
  totalProblems: number;
  createdBy: IUser['_id'];
  createdAt: Date;
}

const TopicSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Topic name is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '📚',
  },
  totalProblems: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

TopicSchema.index({ createdAt: -1 });

const Topic: Model<ITopic> = mongoose.models.Topic || mongoose.model<ITopic>('Topic', TopicSchema);

export default Topic;

