import User from '../database/models/user.model';
import { AccountInterface, UserInterface } from '../../index';
import { ROLES } from '../utils/constants';
import Account from '../database/models/Accounts.model';
import EncryptionService from './Encryption.service';

export default class MembersService {
  constructor(
    private readonly membersRepository: typeof User,
    private readonly accountRepository: typeof Account,
    private readonly encryptionService: EncryptionService
  ) {}

  async getAllMembers(
    filterOptions: any,
    options: {},
    ignorePagination = false
  ): Promise<
    (import('mongoose').Document<unknown, any, UserInterface> &
      UserInterface &
      Required<{ _id: string }>)[]
  > {
    filterOptions.role = ROLES.MEMBER;
    filterOptions.deletedAt = null;
    const members = ignorePagination
      ? await this.membersRepository.find(filterOptions)
      : // @ts-ignore
        await this.membersRepository.paginate(filterOptions, options);
    return members;
  }

  async getMemberById(id: string): Promise<UserInterface> {
    const member = await this.membersRepository.findById(id);
    return member;
  }

  async updateMemberById(
    id: string,
    updateBody: UserInterface
  ): Promise<UserInterface> {
    if (updateBody.password)
      updateBody.password = await this.encryptionService.hashPassword(
        updateBody.password
      );

    const member = await this.membersRepository.findById(id);

    Object.assign(member, updateBody);
    await member.save();
    return member;
  }

  async deleteMember(id: string): Promise<void> {
    await this.membersRepository.findByIdAndDelete(id);
  }

  async getMemberAccount(
    id: string
  ): Promise<
    import('mongoose').Document<unknown, any, AccountInterface> &
      AccountInterface & { _id: import('mongoose').Types.ObjectId }
  > {
    const account = await this.accountRepository.findOne({ user: id });
    return account;
  }

  async createAccountForMember(
    id: string
  ): Promise<
    import('mongoose').Document<unknown, any, AccountInterface> &
      AccountInterface & { _id: import('mongoose').Types.ObjectId }
  > {
    const newAccount = await this.accountRepository.create({ user: id });
    return newAccount;
  }

  async getMembersAccountSummaries() {
    const members = await this.membersRepository.find({ role: ROLES.MEMBER });
    const thriftSavings: any[] = [];
    const shareCapital: any[] = [];
    const fine: any[] = [];
    const loan: any[] = [];
    const projectFinancing: any[] = [];
    const specialDeposit: any[] = [];
    const commodityTrading: any[] = [];

    await Promise.all(
      members.map(async (member) => {
        const account = await this.accountRepository.findOne({
          user: member._id,
        });
        thriftSavings.push(account.accountInformation.thriftSavings);
        shareCapital.push(account.accountInformation.shareCapital);
        fine.push(account.accountInformation.fine);
        loan.push(account.accountInformation.loan);
        projectFinancing.push(account.accountInformation.projectFinancing);
        specialDeposit.push(account.accountInformation.specialDeposit);
        commodityTrading.push(account.accountInformation.commodityTrading);
      })
    );
    const accountSummaries = {
      thriftSavings: thriftSavings.reduce((acc, account) => acc + account),
      shareCapital: shareCapital.reduce((acc, account) => acc + account),
      fine: fine.reduce((acc, account) => acc + account),
      loan: loan.reduce((acc, account) => acc + account),
      projectFinancing: projectFinancing.reduce(
        (acc, account) => acc + account
      ),
      specialDeposit: specialDeposit.reduce((acc, account) => acc + account),
      commodityTrading: commodityTrading.reduce(
        (acc, account) => acc + account
      ),
    };
    return accountSummaries;
  }

  async getAccountTotalDetails(
    filterOptions: any,
    options: any,
    ignorePagination = false
  ) {
    let accountDetails;
    if (filterOptions.account === 'shareCapital') {
      options.select = 'accountInformation.shareCapital';
      accountDetails = ignorePagination
        ? await this.accountRepository.find({
            'accountInformation.shareCapital': { $gt: 0 },
          })
        : // @ts-ignore
          await this.accountRepository.paginate(
            {
              'accountInformation.shareCapital': { $gt: 0 },
            },
            options
          );
    } else if (filterOptions.account === 'thriftSavings') {
      options.select = 'accountInformation.thriftSavings';
      accountDetails = ignorePagination
        ? await this.accountRepository.find({
            'accountInformation.thriftSavings': { $gt: 0 },
          }) // @ts-ignore
        : await this.accountRepository.paginate(
            {
              'accountInformation.thriftSavings': { $gt: 0 },
            },
            options
          );
    } else if (filterOptions.account === 'commodityTrading') {
      options.select = 'accountInformation.commodityTrading';
      accountDetails = ignorePagination
        ? await this.accountRepository.find({
            'accountInformation.commodityTrading': { $gt: 0 },
          }) // @ts-ignore
        : await this.accountRepository.paginate(
            {
              'accountInformation.commodityTrading': { $gt: 0 },
            },
            options
          );
    } else if (filterOptions.account === 'loan') {
      options.select = 'accountInformation.loan';
      accountDetails = ignorePagination
        ? await this.accountRepository.find({
            'accountInformation.loan': { $gt: 0 },
          }) // @ts-ignore
        : await this.accountRepository.paginate(
            {
              'accountInformation.loan': { $gt: 0 },
            },
            options
          );
    } else if (filterOptions.account === 'projectFinancing') {
      options.select = 'accountInformation.projectFinancing';
      accountDetails = ignorePagination
        ? await this.accountRepository.find({
            'accountInformation.projectFinancing': { $gt: 0 },
          }) // @ts-ignore
        : await this.accountRepository.paginate(
            {
              'accountInformation.projectFinancing': { $gt: 0 },
            },
            options
          );
    } else if (filterOptions.account === 'specialDeposit') {
      options.select = 'accountInformation.specialDeposit';
      accountDetails = ignorePagination
        ? await this.accountRepository.find({
            'accountInformation.specialDeposit': { $gt: 0 },
          }) // @ts-ignore
        : await this.accountRepository.paginate(
            {
              'accountInformation.specialDeposit': { $gt: 0 },
            },
            options
          );
    } else if (filterOptions.account === 'fine') {
      options.select = 'accountInformation.fine';
      accountDetails = ignorePagination
        ? await this.accountRepository.find({
            'accountInformation.fine': { $gt: 0 },
          }) // @ts-ignore
        : await this.accountRepository.paginate(
            {
              'accountInformation.fine': { $gt: 0 },
            },
            options
          );
    }
    return accountDetails;
  }

  async getMemberForMembers(id: string) {
    const members = await this.membersRepository
      .find({ role: ROLES.MEMBER, _id: { $ne: id } })
      .select('firstName lastName phoneNumber username');
    return members;
  }
}
