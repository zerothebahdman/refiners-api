import User from '../database/models/user.model';
import { AccountInterface, UserInterface } from '../../index';
import QueryString from 'qs';
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
    filterOptions: QueryString.ParsedQs
  ): Promise<{ members: UserInterface[]; page: number }> {
    const page = Number(filterOptions.page) || 1;
    const limit = Number(filterOptions.limit) || 10;
    const skip = (page - 1) * limit;
    const members = await this.membersRepository
      .find({ role: ROLES.MEMBER })
      .skip(skip)
      .limit(limit);
    return { members, page };
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

  async getAccountTotalDetails(filterOptions: QueryString.ParsedQs) {
    const page = Number(filterOptions.page) || 1;
    const limit = Number(filterOptions.limit) || 10;
    const skip = (page - 1) * limit;
    // const members = await this.membersRepository
    //   .find({ role: ROLES.MEMBER })
    //   .skip(skip)
    //   .limit(limit);
    let accountDetails;
    if (filterOptions.account === 'shareCapital') {
      accountDetails = await this.accountRepository
        .find({
          'accountInformation.shareCapital': { $gt: 0 },
        })
        .sort({ 'accountInformation.shareCapital': -1 })
        .skip(skip)
        .limit(limit)
        .populate('user')
        .select('accountInformation.shareCapital');
    } else if (filterOptions.account === 'thriftSavings') {
      accountDetails = await this.accountRepository
        .find({
          'accountInformation.thriftSavings': { $gt: 0 },
        })
        .sort({ 'accountInformation.thriftSavings': -1 })
        .skip(skip)
        .limit(limit)
        .populate('user')
        .select('accountInformation.thriftSavings');
    } else if (filterOptions.account === 'commodityTrading') {
      accountDetails = await this.accountRepository
        .find({
          'accountInformation.commodityTrading': { $gt: 0 },
        })
        .sort({ 'accountInformation.commodityTrading': -1 })
        .skip(skip)
        .limit(limit)
        .populate('user')
        .select('accountInformation.commodityTrading');
    } else if (filterOptions.account === 'loan') {
      accountDetails = await this.accountRepository
        .find({
          'accountInformation.loan': { $gt: 0 },
        })
        .sort({ 'accountInformation.loan': -1 })
        .skip(skip)
        .limit(limit)
        .populate('user')
        .select('accountInformation.loan');
    } else if (filterOptions.account === 'projectFinancing') {
      accountDetails = await this.accountRepository
        .find({
          'accountInformation.projectFinancing': { $gt: 0 },
        })
        .sort({ 'accountInformation.projectFinancing': -1 })
        .skip(skip)
        .limit(limit)
        .populate('user')
        .select('accountInformation.projectFinancing');
    } else if (filterOptions.account === 'specialDeposit') {
      accountDetails = await this.accountRepository
        .find({
          'accountInformation.specialDeposit': { $gt: 0 },
        })
        .sort({ 'accountInformation.specialDeposit': -1 })
        .skip(skip)
        .limit(limit)
        .populate('user')
        .select('accountInformation.specialDeposit');
    } else if (filterOptions.account === 'fine') {
      accountDetails = await this.accountRepository
        .find({
          'accountInformation.fine': { $gt: 0 },
        })
        .sort({ 'accountInformation.fine': -1 })
        .skip(skip)
        .limit(limit)
        .populate('user')
        .select('accountInformation.fine');
    }
    return { accountDetails, page, limit, skip };
  }

  async getMemberForMembers(id: string) {
    const members = await this.membersRepository
      .find({ role: ROLES.MEMBER, _id: { $ne: id } })
      .select('firstName lastName phoneNumber username');
    return members;
  }
}
