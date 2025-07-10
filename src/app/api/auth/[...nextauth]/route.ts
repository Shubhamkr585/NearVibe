import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import dbConnect from '@/lib/mongoose/dbConnect';
import User from '@/lib/mongoose/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  adapter: MongoDBAdapter({ db: (await dbConnect()).connection.db }),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials?.email });
        if (user && credentials?.password && (await bcrypt.compare(credentials.password, user.password))) {
          return { id: user._id, email: user.email, name: user.name };
        }
        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };