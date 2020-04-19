import * as firebase from 'firebase/app';
import { Ingrediens } from '../models/Ingrediens';
import { Opskrift } from '../models/Opskrift';
import { Tag } from '../models/Tag';
import { AbstractDatabase } from "./AbstractDatabase";

export class FirebaseDatabase extends AbstractDatabase {

    async initialize(): Promise<void> {
        return;
    }

    async getOpskrifter(): Promise<Opskrift[]> {
        const db = firebase.firestore();
        const result = await db.collection('Opskrifter').get();
        return result.docs.map(x=> x.data() as Opskrift);
    }

    async getOpskrift(id: string): Promise<Opskrift | undefined> {
        const db = firebase.firestore();
        const result = await db.collection('Opskrifter').doc(id).get();
        return result.data() as Opskrift | undefined;
    }

    async putOpskrift(opskrift: Opskrift): Promise<void> {
        const db = firebase.firestore();
        await db.collection('Opskrifter').doc(opskrift.id).set(
            opskrift
        );
    }

    async removeOpskrift(id: string): Promise<void> {
        const db = firebase.firestore();
        await db.collection('Opskrifter').doc(id).delete();
    }

    async getIngredienser(): Promise<Ingrediens[]> {
        const db = firebase.firestore();
        const result = await db.collection('Ingredienser').get();
        return result.docs.map(x=> x.data() as Ingrediens);
    }

    async getIngrediens(id: string): Promise<Ingrediens | undefined> {
        const db = firebase.firestore();
        const result = await db.collection('Ingredienser').doc(id).get();
        return result.data() as Ingrediens | undefined;
    }

    async putIngrediens(ingrediens: Ingrediens): Promise<void> {
        const db = firebase.firestore();
        await db.collection('Ingredienser').doc(ingrediens.id).set(
            ingrediens
        );
    }

    async removeIngrediens(id: string): Promise<void> {
        const db = firebase.firestore();
        await db.collection('Ingredienser').doc(id).delete();
    }

    async getTags(): Promise<Tag[]> {
        const db = firebase.firestore();
        const result = await db.collection('Tags').get();
        return result.docs.map(x=> x.data() as Tag);
    }

    async getTag(id: string): Promise<Tag | undefined> {
        const db = firebase.firestore();
        const result = await db.collection('Tags').doc(id).get();
        return result.data() as Tag | undefined;
    }

    async putTag(tag: Tag): Promise<void> {
        const db = firebase.firestore();
        await db.collection('Tags').doc(tag.id).set(
            tag
        );
    }

    async removeTag(id: string): Promise<void> {
        const db = firebase.firestore();
        await db.collection('Tags').doc(id).delete();
    }
}
