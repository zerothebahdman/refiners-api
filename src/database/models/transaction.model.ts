import { Schema, model } from 'mongoose';
import auditableFields from '../plugins/auditableFields.plugin';

const TransactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    transactionType: String,
    amount: String,
    narration: String,
    account: String,
    date: Date,
    ...auditableFields,
  },
  { timestamps: true }
);

const Transaction = model('Transaction', TransactionSchema);
export default Transaction;
