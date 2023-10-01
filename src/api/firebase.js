import {
	collection,
	onSnapshot,
	addDoc,
	getDocs,
	doc,
	updateDoc,
	deleteDoc,
	increment,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './config';
import { getFutureDate, getDaysBetweenDates } from '../utils';

/**
 * A custom hook that subscribes to a shopping list in our Firestore database
 * and returns new data whenever the list changes.
 * @param {string | null} listId
 * @see https://firebase.google.com/docs/firestore/query-data/listen
 */
export function useShoppingListData(listId) {
	// Start with an empty array for our data.
	/** @type {import('firebase/firestore').DocumentData[]} */
	const initialState = [];
	const [data, setData] = useState(initialState);

	useEffect(() => {
		if (!listId) return;

		// When we get a listId, we use it to subscribe to real-time updates
		// from Firestore.
		return onSnapshot(collection(db, listId), (snapshot) => {
			// The snapshot is a real-time update. We iterate over the documents in it
			// to get the data.
			const nextData = snapshot.docs.map((docSnapshot) => {
				// Extract the document's data from the snapshot.
				const item = docSnapshot.data();

				// The document's id is not in the data,
				// but it is very useful, so we add it to the data ourselves.
				item.id = docSnapshot.id;

				return item;
			});

			// Update our React state with the new data.
			setData(nextData);
		});
	}, [listId]);

	// Return the data so it can be used by our React components.
	return data;
}

/**
 * Add a new item to the user's list in Firestore.
 * @param {string} listId The id of the list we're adding to.
 * @param {Object} itemData Information about the new item.
 * @param {string} itemData.itemName The name of the item.
 * @param {number} itemData.daysUntilNextPurchase The number of days until the user thinks they'll need to buy the item again.
 */
export async function addItem(listId, { itemName, daysUntilNextPurchase }) {
	try {
		const listCollectionRef = collection(db, listId);
		return await addDoc(listCollectionRef, {
			dateCreated: new Date(),
			// NOTE: This is null because the item has just been created.
			// We'll use updateItem to put a Date here when the item is purchased!
			dateLastPurchased: null,
			dateNextPurchased: getFutureDate(daysUntilNextPurchase),
			name: itemName,
			totalPurchases: 0,
		});
	} catch (error) {
		throw error;
	}
}

export async function updateItem(
	list,
	itemId,
	dateLastPurchased,
	dateCreated,
	dateNextPurchased,
	totalPurchases,
) {
	const now = Date.now(); //current date in ms
	const dateLastPurchasedOrCreated = dateLastPurchased
		? dateLastPurchased.toDate()
		: dateCreated.toDate();

	const previousEstimate = getDaysBetweenDates(
		dateLastPurchasedOrCreated,
		dateNextPurchased.toDate(),
	);
	const daysSinceLastTransaction = getDaysBetweenDates(
		dateLastPurchasedOrCreated,
		new Date(),
	);

	const daysUntilNextPurchasedDate = calculateEstimate(
		previousEstimate,
		daysSinceLastTransaction,
		totalPurchases,
	);

	const getNewNextPurchasedDate = (days) => {
		const estimatedDaysInMilliseconds = days * 1000 * 60 * 60 * 24;
		const newDateMilliseconds = estimatedDaysInMilliseconds + now;
		return new Date(newDateMilliseconds);
	};

	const newNextPurchasedDate = getNewNextPurchasedDate(
		daysUntilNextPurchasedDate,
	);

	const docRef = doc(db, list, itemId);
	return await updateDoc(docRef, {
		dateLastPurchased: new Date(),
		totalPurchases: increment(1),
		dateNextPurchased: newNextPurchasedDate,
	});
}

export async function deleteItem(list, itemId) {
	const deleteDocRef = doc(db, list, itemId);
	return await deleteDoc(deleteDocRef);
}

export async function getExistingList(listId) {
	if (!listId) {
		throw new Error('List ID is missing or empty.');
	}

	const collectionRef = collection(db, listId);
	const snapshot = await getDocs(collectionRef);
	if (!snapshot.empty) {
		return snapshot;
	} else {
		return false;
	}
}

//comparePurchaseUrgency
export function comparePurchaseUrgency(data) {
	const today = new Date();
	//SORT OUT INACTIVE ITEMS
	// use filter function to filter through data array

	const isInactive = (item) => {
		const lastPurchased = item.dateLastPurchased?.toDate();
		const daysSinceLastPurchased = getDaysBetweenDates(
			lastPurchased ? lastPurchased : new Date(),
			today,
		);
		const isInactive = daysSinceLastPurchased > 60;
		const recentlyPurchased = lastPurchased
			? daysSinceLastPurchased < 1
			: false;
		return isInactive || recentlyPurchased;
	};

	const activeItems = [];
	const inactiveItems = [];

	data.forEach((item) =>
		isInactive(item) ? inactiveItems.push(item) : activeItems.push(item),
	);

	//sorts items in ascending order of days until purchase first, then by name
	const sortItems = (a, b) => {
		const daysUntilNextPurchaseA = Math.round(
			getDaysBetweenDates(today, a.dateNextPurchased.toDate()),
		);
		const daysUntilNextPurchaseB = Math.round(
			getDaysBetweenDates(today, b.dateNextPurchased.toDate()),
		);

		// If the number of days until the next purchase is equal, sort by name
		if (daysUntilNextPurchaseA === daysUntilNextPurchaseB) {
			return a.name.localeCompare(b.name);
		}
		// Otherwise, sort by the number of days until the next purchase
		return a.dateNextPurchased.seconds - b.dateNextPurchased.seconds;
	};

	return activeItems.sort(sortItems).concat(inactiveItems.sort(sortItems));
}

/**
 * Copied from TCL lib because it was returning the days since last if totalPurchases is less than two.
 * Instead, this returns the previous estimate which makes more sense.
 * @param previousEstimate
 * @param daysSinceLastTransaction
 * @param totalPurchases
 * @returns {number}
 */
export const calculateEstimate = (
	previousEstimate = 14, // The last estimated purchase interval
	daysSinceLastTransaction, // The number of days since the item was added to the list or last purchased
	totalPurchases, // Total number of purchases for the item
) => {
	// Not enough data if an item has been purchased 1 time,
	// just set the estimate based on when it was added to the list
	if (totalPurchases < 2) return previousEstimate; // TODO open a PR against TCL because we should return this
	// This calculates how many days should have passed based on
	// the previous estimate between purchases and the total number of purchased
	const previousFactor = previousEstimate * totalPurchases;
	// This calculates how many days should have passed based on
	// the interval between the most recent transactions
	// Subtract 1 here to exclude the current purchase in this factor
	const latestFactor = daysSinceLastTransaction * (totalPurchases - 1);
	// Divisor is used to find the average between the two factors
	// Multiplied by 2 between we will add 2 factors together
	// Subtract 1 here to lower weight of the current purchase in this factor
	const totalDivisor = totalPurchases * 2 - 1;
	//Calculate the average interval between the previous factor and the latest factor
	return Math.round((previousFactor + latestFactor) / totalDivisor);
};
