import { useEffect, useState } from "react";
import styles from "../../styles/AdminLogin.module.css";
import {getSession, signIn} from "next-auth/react";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { useRouter } from "next/router";

const AdminLogin = ({session, callbackUrl}: {session: Session | null, callbackUrl: string}) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('here')
        try {
            setError('');
            setLoading(true);
            // await signIn('credentials', { userName, password, callbackUrl: callbackUrl})
            let response = await fetch('/api/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({credentials: {userName: userName, password: password}})
            });
            let data = await response.json();
            
            if (data.error) {
                setError(data.error);
            }
            else if (response.status === 200){
                localStorage.setItem('tr-admin', JSON.stringify(data));
                router.push('/tr-admin');
            }
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
    const { req } = context;
    const session = getSession({ req });
    
    if (session) {
        return {
            props: {
                session: JSON.parse(JSON.stringify(session)),
                callbackUrl: JSON.parse(JSON.stringify(context.query["callbackUrl"] || "https://nbatradderumo.com/tr-admin"))
            }
        }
    }

    return {
        props: {session: null}
    };
}

AdminLogin.auth = false;

export default AdminLogin;
