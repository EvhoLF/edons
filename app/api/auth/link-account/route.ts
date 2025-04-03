// app/api/link-account/route.ts
import { NextResponse } from 'next/server';
import { IUser, User } from '@/DB/models/User';
import connectDB from '@/DB/connectDB';
import { getServerSession } from 'next-auth';
import { decryptData, decryptDataURI } from '@/utils/uid_crypto';
import { Account, IAccount } from '@/DB/models/Account';
import mongoose from 'mongoose';
import { authOptions } from '@/libs/auth';
import { LogActions, LogStatuses } from '@/DB/models/Log';
import { LogCreate } from '@/DB/services/LogService';

interface IREQ_DATA {
  mainUser: string;
  linkUser: string;
  lastProvider: 'github' | 'google';
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { mainUser, linkUser, lastProvider }: IREQ_DATA = await req.json();

    const decryptMainUser = decryptDataURI(mainUser);
    const decryptLinkUser = decryptData(linkUser);

    const User_main: IUser | null = await User.findById(decryptMainUser);
    const User_link: IUser | null = await User.findById(decryptLinkUser);

    if (!User_main || !User_link) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const Account_main: IAccount | null = await Account.findOne({ provider: lastProvider, userId: User_main.id });
    if (Account_main) await Account.findByIdAndDelete(Account_main.id);

    const Account_link: IAccount | null = await Account.findOne({ provider: lastProvider, userId: User_link.id });

    if (!Account_link) return NextResponse.json({ error: 'Account not found' }, { status: 404 });

    User_main[lastProvider] = Account_link.providerAccountId;
    User_link[lastProvider] = null;
    Account_link.userId = new mongoose.Types.ObjectId(User_main.id);

    await User_main.save();
    await User_link.save();
    await Account_link.save();

    LogCreate({
      userId: User_main?.id || null, action: LogActions.USER_LINK, status: LogStatuses.SUCCESS,
      description: `User_main ID - ${User_main?.id || ''}; User_link ID - ${User_link?.id || ''}; Account_link - ${Account_link.id}`
    });
    return NextResponse.json({ message: 'Account linked successfully', userId: User_main.id });
  }
  catch (error) {
    return NextResponse.json({ message: "Error account linked", error }, { status: 500 });
  }
}