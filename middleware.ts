import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server';

export default withAuth(
    function middleware(req: NextRequest){
        return NextResponse.rewrite(new URL("/tr-admin/dashboard", req.url))
    },
    {
        callbacks: {
            authorized({token}){
                if(token?.role === "admin") {
                    console.log("role was good")
                    return true
                }
                return false
            }
        }
    }
);

export const config = {matcher: ['/tr-admin/dashboard']}