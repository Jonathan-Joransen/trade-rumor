import { withAuth } from 'next-auth/middleware'

export default withAuth(
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