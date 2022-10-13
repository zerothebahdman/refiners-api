import { Schema, model } from 'mongoose';
import auditableFields from '../plugins/auditableFields.plugin';
import { TRANSACTION_TYPE } from '../../utils/constants';

const TransactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    transactionType: { type: String, enum: Object.values(TRANSACTION_TYPE) },
    amount: String,
    description: String,
    account: String,
    date: String,
    balance: Number,
    ...auditableFields,
  },
  { timestamps: true }
);

const Transaction = model('Transaction', TransactionSchema);
export default Transaction;
