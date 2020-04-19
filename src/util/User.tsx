import * as firebase from 'firebase/app';

export interface User {
    displayName: string;
    email: string;
}

export function currentUserFirstTime(): Promise<User | undefined> {
    return new Promise(resolve => {

        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser != null) {
                resolve({
                    displayName: firebaseUser.displayName ?? 'Ukendt bruger',
                    email: firebaseUser.email ?? ''
                });
                // User is signed in.
            } else {
                resolve(undefined);
            }
        });
    });
}


export async function currentUser(): Promise<User | undefined> {

    const firebaseUser = firebase.auth().currentUser;
    if (firebaseUser == null)
        return undefined;

    return {
        displayName: firebaseUser.displayName ?? 'Ukendt bruger',
        email: firebaseUser.email ?? ''
    };
}

export async function login(): Promise<void> {
    const provider = new firebase.auth.GoogleAuthProvider();
    const auth = firebase.auth();
    const result = await auth.signInWithRedirect(provider);
    console.log(result);
}

export function logout(): Promise<void> {
    return firebase.auth().signOut();
}
