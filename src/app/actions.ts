

'use server';

import {
  generatePersonalizedTips,
  type GeneratePersonalizedTipsInput,
} from '@/ai/flows/generate-personalized-tips';
import type { Loan, LoanRequest, Article, Offer, PersonalTransaction, Payment } from '@/lib/types';
import { useLoanStore } from '@/hooks/use-loan-store';
import { addDays, format } from 'date-fns';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, Timestamp, addDoc, orderBy } from 'firebase/firestore';


export async function getPersonalizedTips(
  input: GeneratePersonalizedTipsInput
) {
  const { personalizedTips } = await generatePersonalizedTips(input);
  return personalizedTips;
}

export async function submitLoanRequest(
  loanDetails: LoanRequest & { weeklyPayment: number }
): Promise<{ success: boolean; message: string; newLoan: Loan }> {
  console.log('New loan request received:', loanDetails);

  const newLoan: Loan = {
    id: `LN${Math.floor(Math.random() * 90000) + 10000}`,
    amount: loanDetails.amount,
    interestRate: 0, // This should be calculated based on duration
    termInWeeks: loanDetails.durationInWeeks,
    status: 'Pending',
    nextPaymentDate: 'N/A',
    nextPaymentAmount: loanDetails.weeklyPayment, // Assuming weekly payments for now
  };

  return {
    success: true,
    message: `Your loan request for ZMW ${loanDetails.amount} has been submitted for review.`,
    newLoan,
  };
}

export async function updateLoanStatus(loanId: string, status: 'Active' | 'Rejected'): Promise<{ success: boolean, updatedLoan: Partial<Loan> }> {
  let updatedFields: Partial<Loan> = { status };

  if (status === 'Active') {
    updatedFields.nextPaymentDate = format(addDays(new Date(), 7), 'yyyy-MM-dd');
  }

  return {
    success: true,
    updatedLoan: updatedFields,
  };
}

export async function getArticles(): Promise<Article[]> {
  try {
    const articlesCollection = collection(db, 'articles');
    const articleSnapshot = await getDocs(articlesCollection);
    const articlesList = articleSnapshot.docs.map(doc => {
      const data = doc.data();
      // Ensure createdAt is converted correctly
      const createdAt = data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate().toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0];

      return {
        id: doc.id,
        title: data.title || 'Untitled',
        author: data.author || 'Unknown Author',
        excerpt: data.excerpt || '',
        content: data.content || '',
        imageUrl: data.imageUrl || 'https://placehold.co/600x400.png',
        dataAiHint: data.dataAiHint || 'article image',
        createdAt,
      } as Article;
    });
    return articlesList;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const articleDocRef = doc(db, 'articles', id);
    const articleSnapshot = await getDoc(articleDocRef);

    if (!articleSnapshot.exists()) {
      return null;
    }

    const data = articleSnapshot.data();
    const createdAt = data.createdAt instanceof Timestamp 
      ? data.createdAt.toDate().toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0];

    return {
      id: articleSnapshot.id,
      title: data.title || 'Untitled',
      author: data.author || 'Unknown Author',
      excerpt: data.excerpt || '',
      content: data.content || 'No content available.',
      imageUrl: data.imageUrl || 'https://placehold.co/1200x600.png',
      dataAiHint: data.dataAiHint || 'article banner',
      createdAt,
    } as Article;
  } catch (error) {
    console.error("Error fetching article by ID:", error);
    return null;
  }
}

export async function getOffers(): Promise<Offer[]> {
  try {
    const offersCollection = collection(db, 'offers');
    const q = query(offersCollection, where('isActive', '==', true));
    const offerSnapshot = await getDocs(q);
    const offersList = offerSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || 'Untitled Offer',
        description: data.description || '',
        discount: data.discount || '',
      } as Offer;
    });
    return offersList;
  } catch (error) {
    console.error("Error fetching offers:", error);
    return [];
  }
}

export async function getTransactions(): Promise<PersonalTransaction[]> {
    try {
        const transactionsCollection = collection(db, 'transactions');
        const q = query(transactionsCollection, orderBy('date', 'desc'));
        const transactionSnapshot = await getDocs(q);
        const transactionsList = transactionSnapshot.docs.map(doc => {
            const data = doc.data();
            const date = data.date instanceof Timestamp
                ? data.date.toDate().toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0];

            return {
                id: doc.id,
                type: data.type,
                amount: data.amount,
                description: data.description,
                category: data.category,
                date,
            } as PersonalTransaction;
        });
        return transactionsList;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }
}

export async function addTransaction(transaction: Omit<PersonalTransaction, 'id' | 'date'>): Promise<PersonalTransaction> {
    try {
        const docRef = await addDoc(collection(db, 'transactions'), {
            ...transaction,
            date: Timestamp.now(),
        });
        
        const newTransaction: PersonalTransaction = {
            id: docRef.id,
            ...transaction,
            date: new Date().toISOString().split('T')[0],
        };
        return newTransaction;
    } catch (error) {
        console.error("Error adding transaction:", error);
        throw new Error("Failed to add transaction.");
    }
}

export async function getPayments(): Promise<Payment[]> {
  try {
    const paymentsCollection = collection(db, 'payments');
    const q = query(paymentsCollection, orderBy('date', 'desc'));
    const paymentSnapshot = await getDocs(q);
    const paymentsList = paymentSnapshot.docs.map(doc => {
      const data = doc.data();
      const date = data.date instanceof Timestamp 
        ? data.date.toDate().toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0];
      
      return {
        id: doc.id,
        loanId: data.loanId || 'N/A',
        amount: data.amount || 0,
        status: data.status || 'pending',
        date,
      } as Payment;
    });
    return paymentsList;
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
}
