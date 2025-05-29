import { useState, useEffect } from 'react';
import styles from './styles/LogoutScreen.module.css';

const LogoutScreen = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prevDots => {
                if (prevDots.length < 3) {
                    return prevDots + '.';
                }
                return '';
            });
        }, 300);

        const timer = setTimeout(() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/'; 
        }, 2000);

        return () => {
            clearInterval(interval);
            clearTimeout(timer); 
        };
    }, []); 

    return (
        <div className={styles.logoutContainer}>
            <div className={styles.logoutContent}>
                <h1>Logging out{dots}</h1>
                <p>Please wait while we securely log you out.</p>
            </div>
        </div>
    );
}

export default LogoutScreen;