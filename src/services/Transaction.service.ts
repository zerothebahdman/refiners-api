import Account from '../database/models/Accounts.model';
import Transaction from '../database/models/transaction.model';
export default class TransactionService {
  constructor(private readonly transactionRepository: typeof Transaction) {}

  async storeTransaction(creditBody: any): Promise<any> {
    const transaction = await this.transactionRepository.create(creditBody);
    return transaction;
  }

  async getTransactionsByMember(
    filterOptions: any,
    options: {},
    ignorePagination = false
  ) {
    let transactions;
    filterOptions.account = filterOptions.filter;
    if (filterOptions.filter === 'allTransactions') {
      delete filterOptions.filter;
      delete filterOptions.account;
      console.log(filterOptions);
      transactions = ignorePagination
        ? await this.transactionRepository.find({
            user: filterOptions.user,
          })
        : // @ts-ignore
          await this.transactionRepository.paginate(filterOptions, options);
    } else if (filterOptions.filter === 'thriftSavings') {
      filterOptions.account = 'thriftSavings';
      transactions = ignorePagination
        ? await this.transactionRepository.find({
            user: filterOptions.user,
            account: 'thriftSavings',
          }) // @ts-ignore
        : await this.transactionRepository.paginate(filterOptions, options);
    } else if (filterOptions.filter === 'shareCapital') {
      filterOptions.account = 'shareCapital';
      transactions = ignorePagination
        ? await this.transactionRepository.find({
            user: filterOptions.user,
            account: 'shareCapital',
          }) // @ts-ignore
        : await this.transactionRepository.paginate(filterOptions, options);
    } else if (filterOptions.filter === 'fine') {
      filterOptions.account = 'fine';
      transactions = ignorePagination
        ? await this.transactionRepository.find({
            user: filterOptions.user,
            account: 'fine',
          }) // @ts-ignore
        : await this.transactionRepository.paginate(filterOptions, options);
    } else if (filterOptions.filter === 'loan') {
      filterOptions.account = 'line';
      transactions = ignorePagination
        ? await this.transactionRepository.find({
            user: filterOptions.user,
            account: 'loan',
          }) // @ts-ignore
        : await this.transactionRepository.paginate(filterOptions, options);
    } else if (filterOptions.filter === 'projectFinancing') {
      filterOptions.account = 'projectFinancing';
      transactions = ignorePagination
        ? await this.transactionRepository.find({
            user: filterOptions.user,
            account: 'projectFinancing',
          }) // @ts-ignore
        : await this.transactionRepository.paginate(filterOptions, options);
    } else if (filterOptions.filter === 'specialDeposit') {
      filterOptions.account = 'specialDeposit';
      transactions = ignorePagination
        ? await this.transactionRepository.find({
            user: filterOptions.user,
            account: 'specialDeposit',
          }) // @ts-ignore
        : await this.transactionRepository.paginate(filterOptions, options);
    } else if (filterOptions.filter === 'commodityTrading') {
      filterOptions.account = 'commodityTrading';
      transactions = ignorePagination
        ? await this.transactionRepository.find({
            user: filterOptions.user,
            account: 'commodityTrading',
          }) // @ts-ignore
        : await this.transactionRepository.paginate(filterOptions, options);
    }
    const account = await Account.findOne({ user: filterOptions.user });
    account.toJSON;
    return transactions;
  }
}
