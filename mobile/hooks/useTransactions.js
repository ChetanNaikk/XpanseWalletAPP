// react custom hook file

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';

const API_URL = 'https://xpansewalletapi.onrender.com/api'; // Replace with your API URL

export const useTransactions = (userId) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ 
        balance: 0,
        income: 0,
        expense: 0
        });
        const [isLoading, setIsLoading] = useState(true);

        //useCallback to memoize the fetch function
        const fetchTransactions = useCallback(async () => {
            try {
                const respone = await fetch(`${API_URL}/transactions/${userId}`);
                const data = await respone.json();
                setTransactions(data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        }, [userId]);

        const fetchSummary = useCallback(async () => {
            try {
                const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
                const data = await response.json();
                setSummary(data);
            } catch (error) {
                console.error('Error fetching summary:', error);
            }
        }, [userId]);


        const loadData = useCallback(async () => {
            if (!userId) return;

            setIsLoading(true);
            try {
                // can be run in parallel
                await Promise.all([fetchTransactions(), fetchSummary()]);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setIsLoading(false);
            }
        }, [fetchTransactions, fetchSummary, userId]);

        const deleteTransaction = async (id) => {
            try {
                const response = await fetch(`${API_URL}/transactions/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok)
                    throw new Error('Failed to delete transaction');
                
                    // Refetch data after deletion
                loadData();
                Alert.alert(
                    'Success',
                    'Transaction deleted successfully',
                );
            } catch (error) {
                console.error('Error deleting transaction:', error);
                Alert.alert('Error',error.message || 'Failed to delete transaction');
            };
        };
        
    return {
        transactions,
        summary,
        isLoading,
        loadData,
        deleteTransaction
    };
}

