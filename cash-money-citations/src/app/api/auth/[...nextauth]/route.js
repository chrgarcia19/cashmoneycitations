import dbConnect from "../../../../utils/dbConnect";
import NextAuth from "next-auth/next";
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Github",
      credentials: {},
      name: "credentials",
      credentials: {},


      async authorize(credentials){
        const { username, password } = credentials;
        try {
          await dbConnect();
          const user = await User.findOne({username});

          /*if (!user){
            return null;
          }*/

          const passwordMatch = await bcrypt.compare(password, user.password);

          /*if (!passwordMatch){
            return null;
          }*/

          return user;
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/app/login",
  },
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};