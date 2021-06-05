import firebase from 'firebase/app';

// We are defining here our 'Entry' object using the interface
export interface Entry {
    id: string;
    date: string;
    title: string;
    pictureUrl: string;
    description: string;
}

export function toEntry(doc: firebase.firestore.DocumentSnapshot): Entry {
    return {
        id: doc.id,
        // '...' (= Spread Operator) => copy old properties + keeping other properties + Adding them as elements to a new array
        ...doc.data() // Copy & Distribute the entire old 'doc.data()' => keeping other properties
    } as Entry; // 'as Entry' => casting 'entry' as an 'Entry' object to let know Type-Script of it
}