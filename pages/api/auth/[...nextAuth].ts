import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';

const options: NextAuthOptions = {
    session: {
        strategy: "jwt"
    },
  providers: [    
    CredentialsProvider({
          name: 'Admin Login',
          credentials: {
          },
          async authorize(credentials, req) {
            const res = await fetch(`/api/auth/admin-login`, {
              method: 'POST',
              body: JSON.stringify(credentials),
              headers: { "Content-Type": "application/json" }
            })
            const user = await res.json()
      
            // If no error and we have user data, return it
            if (res.ok && user) {
              return user
            }
            // Return null if user data could not be retrieved
            return null
          }
        })      
  ],
  pages: {
    signIn: "/tr-admin",
  },
    callbacks: {
        jwt(params: any) {
            if(params?.user?.role === "admin") {
                params.token.role = params.user.role
            }
            return params.token
        }
    },
};

export default (req: NextApiRequest, res: NextApiResponse<any>) => NextAuth(req, res, options);
