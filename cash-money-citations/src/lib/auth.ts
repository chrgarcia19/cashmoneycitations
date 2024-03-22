import dbConnect from "@/utils/dbConnect";
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import User from "@/models/User";
import { NextAuthOptions, getServerSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from 'next-auth/providers/google';

export const authConfig: NextAuthOptions = ({
  providers: [
    CredentialsProvider({
      name: "Sign In",
      credentials: {
        username: { label: "Username"},
        password: { label: "Password"},
      },

      async authorize(credentials){
        if (!credentials || !credentials.username || !credentials.password) {
          return null;
          
        }
        
        try {
          await dbConnect();
          const user = await User.findOne({username: credentials.username});

          if (!user){
            return null;
          }

          const passwordMatch = await bcrypt.compare(credentials.password, user.password);

          if (!passwordMatch){
            return null;
          }

          return user;
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
    GithubProvider({
      async profile(profile) {
        return Promise.resolve({ id: profile.id, email: profile.email, image: profile.avatar_url, role: profile.role ?? "user" });
      },
      clientId: process.env.GITHUB_APP_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_APP_CLIENT_SECRET as string,
    }),

    GoogleProvider({
      async profile(profile) {
        return Promise.resolve({ id: profile.sub, email: profile.email, image: profile.picture, name: profile.name, role: profile.role ?? "user" });
      },
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,

    }),
    
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      await dbConnect();

      let dbUser = await User.findOne({ email: profile?.email });
        
        if (!dbUser) {
          dbUser = await User.create({ 
            // Create 1st time user fields (OAuth users)
            username: profile?.name, 
            email: profile?.email, 
            image: profile?.image, 
            accounts: [{ provider: account?.provider, providerAccountId: account?.id }],
            ownedReferences: [],
          })
  
        }
      
      return Promise.resolve(true)
    },
    async jwt({token, trigger, user, session }) {
      const oauthDbId = await User.findOne({
        email: token.email, 
      })

      token.id = oauthDbId.id;
      if (trigger === "update" && session) {
        return { ...token, ...session?.user };
      }
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.image = user.image;
      }
      return token;
    },
    async session({session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.image = token.image;
      }
      return session;
    }

  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});

export const getServerAuthSession = () => getServerSession(authConfig); //(6) 


