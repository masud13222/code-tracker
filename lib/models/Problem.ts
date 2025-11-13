import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';
import { ITopic } from './Topic';

export interface IProblem extends Document {
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  externalLink: string;
  topicId: ITopic['_id'];
  order: number;
  isRecommended: boolean;
  createdBy: IUser['_id'];
  createdAt: Date;
}

const ProblemSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Problem name is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: [true, 'Difficulty is required'],
  },
  tags: {
    type: [String],
    default: [],
  },
  externalLink: {
    type: String,
    required: [true, 'External link is required'],
    trim: true,
  },
  topicId: {
    type: Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  isRecommended: {
    type: Boolean,
    default: false,
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

// Indexes for faster queries
ProblemSchema.index({ topicId: 1, order: 1 });
ProblemSchema.index({ difficulty: 1 });
ProblemSchema.index({ tags: 1 });
ProblemSchema.index({ createdAt: -1 });

const Problem: Model<IProblem> = mongoose.models.Problem || mongoose.model<IProblem>('Problem', ProblemSchema);

export default Problem;

