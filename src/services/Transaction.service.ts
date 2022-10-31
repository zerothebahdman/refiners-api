import QueryString from 'qs';
import Account from '../database/models/Accounts.model';
import Transaction from '../database/models/transaction.model';
export default class TransactionService {
  constructor(private readonly transactionRepository: typeof Transaction) {}

  async storeTransaction(creditBody: any): Promise<any> {
    const transaction = await this.transactionRepository.create(creditBody);
    return transaction;
  }

  async getTransactionsByMember(filterOptions: QueryString.ParsedQs) {
    const page = Number(filterOptions.page) || 1;
    const limit = Number(filterOptions.limit) || 10;
    const skip = (page - 1) * limit;
    let transactions;
    let totalNumberOfTransactions;
    if (filterOptions.allTransactions) {
      transactions = await this.transactionRepository
        .find({ user: filterOptions.user })
        .skip(skip)
        .limit(limit);
      totalNumberOfTransactions =
        await this.transactionRepository.countDocuments({
          user: filterOptions.user,
        });
    } else if (filterOptions.thriftSavings) {
      transactions = await this.transactionRepository
        .find({ user: filterOptions.user, account: 'thriftSavings' })
        .skip(skip)
        .limit(limit);
      totalNumberOfTransactions =
        await this.transactionRepository.countDocuments({
          user: filterOptions.user,
          account: 'thriftSavings',
        });
    } else if (filterOptions.shareCapital) {
      transactions = await this.transactionRepository
        .find({ user: filterOptions.user, account: 'shareCapital' })
        .skip(skip)
        .limit(limit);
      totalNumberOfTransactions =
        await this.transactionRepository.countDocuments({
          user: filterOptions.user,
          account: 'shareCapital',
        });
    } else if (filterOptions.fine) {
      transactions = await this.transactionRepository
        .find({ user: filterOptions.user, account: 'fine' })
        .skip(skip)
        .limit(limit);
      totalNumberOfTransactions =
        await this.transactionRepository.countDocuments({
          user: filterOptions.user,
          account: 'fine',
        });
    } else if (filterOptions.loan) {
      transactions = await this.transactionRepository
        .find({ user: filterOptions.user, account: 'loan' })
        .skip(skip)
        .limit(limit);
      totalNumberOfTransactions =
        await this.transactionRepository.countDocuments({
          user: filterOptions.user,
          account: 'loan',
        });
    } else if (filterOptions.projectFinancing) {
      transactions = await this.transactionRepository
        .find({
          user: filterOptions.user,
          account: 'projectFinancing',
        })
        .skip(skip)
        .limit(limit);
      totalNumberOfTransactions =
        await this.transactionRepository.countDocuments({
          user: filterOptions.user,
          account: 'projectFinancing',
        });
    } else if (filterOptions.specialDeposit) {
      transactions = await this.transactionRepository
        .find({ user: filterOptions.user, account: 'specialDeposit' })
        .skip(skip)
        .limit(limit);
      totalNumberOfTransactions =
        await this.transactionRepository.countDocuments({
          user: filterOptions.user,
          account: 'specialDeposit',
        });
    } else if (filterOptions.commodityTrading) {
      transactions = await this.transactionRepository
        .find({ user: filterOptions.user, account: 'commodityTrading' })
        .skip(skip)
        .limit(limit);
      totalNumberOfTransactions =
        await this.transactionRepository.countDocuments({
          user: filterOptions.user,
          account: 'commodityTrading',
        });
    }
    const account = await Account.findOne({ user: filterOptions.user });
    account.toJSON;
    return { transactions, page, limit, account, totalNumberOfTransactions };
  }
}
