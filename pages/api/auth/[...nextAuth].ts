import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';

const options: NextAuthOptions = {
    session: {
        strategy: "jwt"
    },
  providers: [    
    CredentialsProvider({
          name: 'Admin Signin',
          credentials: {
          },
          async authorize(credentials, req) {
            const {userName, password} = JSON.parse(JSON.stringify(credentials))
    
            if(userName === "admin" && password === process.env.ADMIN_PASSWORD) {
              return JSON.parse(JSON.stringify({name: "Admin", role: "admin"}))
            }
            
            // Return null if user data could not be retrieved
            return null
          }
        })      
  ],
  pages: {
    signIn: "/tr-admin/signin",
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
