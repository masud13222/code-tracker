import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';
import { IProblem } from './Problem';

export interface ICompletion extends Document {
  userId: IUser['_id'];
  problemId: IProblem['_id'];
  completedAt: Date;
}

const CompletionSchema: Schema = new Schema({
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
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure a user can only complete a problem once
CompletionSchema.index({ userId: 1, problemId: 1 }, { unique: true });
// Index for faster queries
CompletionSchema.index({ userId: 1 });
CompletionSchema.index({ problemId: 1 });
CompletionSchema.index({ completedAt: -1 });

const Completion: Model<ICompletion> = mongoose.models.Completion || mongoose.model<ICompletion>('Completion', CompletionSchema);

export default Completion;

