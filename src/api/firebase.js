import {
	collection,
	onSnapshot,
	addDoc,
	getDocs,
	query,
	where,
	doc,
	updateDoc,
	increment,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './config';
import { getFutureDate, getDaysBetweenDates } from '../utils';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';

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

export async function deleteItem() {
	/**
	 * TODO: Fill this out so that it uses the correct Firestore function
	 * to delete an existing item. You'll need to figure out what arguments
	 * this function must accept!
	 */
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
	const inactiveItems = data.filter(
		//filter items where today's date - last purchase date > 60
		(item) =>
			item.dateLastPurchased &&
			getDaysBetweenDates(item.dateLastPurchased?.toDate(), today) > 60,
	);

	//SORT OUT ACTIVE ITEMS
	const activeItems = data.filter(
		//filter items where there's no date last purchased OR today's date - last purchase date < 60 days
		(item) =>
			!item.dateLastPurchased ||
			(item.dateLastPurchased &&
				getDaysBetweenDates(item.dateLastPurchased.toDate(), today) < 60),
	);

	//sorts items in ascending order of days until purchase, and
	//use sort function to sort data prop array
	const sortedActiveItems = activeItems.sort(
		//pass a custom sorting function that compares the dateNextPurchased.seconds property of each element
		// this will sort the array in descending order based on the date next purchase value
		(a, b) => {
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
		},
	);

	//SORT ALPHABETICALLY
	// using sorted active items
	// compare each item to next item to see if days until next purchase is equal
	//if not equal
	//do nothing
	// if equal compare first letter of each name
	//sort by alphabetical order
	//if equal...

	//add the inactive elements to the end of the sorted array
	const timeSortedItems = sortedActiveItems.concat(inactiveItems);

	//TESTING
	console.log('inactive items: ', inactiveItems);
	console.log('active items: ', activeItems);
	console.log('sorted active items: ', sortedActiveItems);
	console.log('all items sorted: ', timeSortedItems);
	timeSortedItems.map((item) => {
		console.log(
			'item name',
			item.name,
			'-> days until next purchase: ',
			Math.round(getDaysBetweenDates(today, item.dateNextPurchased.toDate())),
		);
	});

	return timeSortedItems;
}

//sorts items with the same days until purchase alphabetically
