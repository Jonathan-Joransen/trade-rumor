import { useEffect, useState } from "react";
import styles from "../../styles/AdminLogin.module.css";
import {signIn, getSession} from "next-auth/react";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { useRouter } from "next/router";

const AdminLogin = ({session, signedIn}: {session: Session | null, signedIn: boolean}) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (signedIn) {
            router.push('/tr-admin/dashboard');
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await signIn('credentials', { userName, password, callbackUrl: `http://localhost:3000/tr-admin/dashboard`})
        } catch {
            setError('Failed to log in');
        }
        setLoading(false);
    };
    
    return (
        <div className={styles.container}>
            <h1>Admin Login</h1>
            <form onSubmit={handleSubmit}>
                <div className={styles.inputs}>
                <label>UserName</label>
                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className={styles.button} type="submit" disabled={loading}>Log In</button>
                </div>
            </form>
            <div className={styles.error}>{error}</div>
        </div>
    );
};


export const getServerSideProps: GetServerSideProps = async (context) => {
    const {req, res} = context;

    const session = await getSession(context);
    if (session !== null) {
        return {props: {session: session, signedIn: true}};
    }

    return {
        props: {session: null, signedIn: false}
    };
}


export default AdminLogin;
