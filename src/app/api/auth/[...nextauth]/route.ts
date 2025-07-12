import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter'; // Use @auth/mongodb-adapter for NextAuth v5
import clientPromise from '@/lib/mongoose/dbConnect';
import User from '@/lib/mongoose/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db('nearvibe');
        const user = await db.collection('users').findOne({ email: credentials?.email });
        if (user && credentials?.password && (await bcrypt.compare(credentials.password, user.password))) {
          return { id: user._id.toString(), email: user.email, name: user.name };
        }
        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
export { handlers as GET, handlers as POST };