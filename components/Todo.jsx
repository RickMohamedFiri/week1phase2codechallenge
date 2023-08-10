import { useState, useEffect } from "react";
import styles from '../styles/Home.module.css';
import { BsTrashFill } from 'react-icons/bs';

const Cart = () => {
    const [transactions, setTransactions] = useState([]);
    const [newTransaction, setNewTransaction] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = () => {
        fetch('http://localhost:9500/transactions') // Replace with your actual backend URL
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setTransactions(data.transactions || []);
            })
            .catch(error => {
                console.error('Error fetching transactions:', error);
            });
    }

    const handleInputChange = (e) => {
        setNewTransaction(e.target.value);
    };

    const addItem = () => {
        const newTransactionItem = {
            description: newTransaction,
            // Add other properties like date, category, amount as needed
            id: Date.now() // Generate a temporary ID
        };
        
        setTransactions(prevTransactions => [...prevTransactions, newTransactionItem]);
        setNewTransaction('');
    }

    const removeItem = (id) => {
        setTransactions(prevTransactions => prevTransactions.filter(item => item.id !== id));
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredTransactions = transactions.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className={styles.main}>
                <div className={styles.cart}>
                    <div className={styles.title}>
                        <h2>Transaction App</h2>
                        <div className={styles.form} >
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Enter description"
                                value={newTransaction}
                                onChange={handleInputChange}
                            />
                            <button className={styles.submit} onClick={addItem}>
                                Add
                            </button>
                        </div>
                        <div className={styles.search}>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Search by description"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                    <div className={styles.list}>
                        { filteredTransactions.map(transaction => (
                            <div key={transaction.id} className={styles.li}>
                                <BsTrashFill
                                    className={styles.delete}
                                    onClick={() => removeItem(transaction.id)}
                                />
                                <p>
                                    {transaction.description}
                                </p>
                            </div>
                        )) }
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cart;
