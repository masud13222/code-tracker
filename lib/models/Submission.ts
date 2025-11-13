import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';
import { IProblem } from './Problem';

export interface ISubmission extends Document {
  userId: IUser['_id'];
  problemId: IProblem['_id'];
  code: string;
  language: string;
  notes: string;
  submittedAt: Date;
}

const SubmissionSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: 'cpp',
  },
  notes: {
    type: String,
    default: '',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for faster queries
SubmissionSchema.index({ userId: 1, problemId: 1 });
SubmissionSchema.index({ problemId: 1 });
SubmissionSchema.index({ submittedAt: -1 });

const Submission: Model<ISubmission> = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);

export default Submission;

