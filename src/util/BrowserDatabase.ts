import { DBSchema, IDBPDatabase, openDB } from 'idb';
import { Ingrediens } from '../models/Ingrediens';
import { Opskrift } from '../models/Opskrift';
import { Tag } from '../models/Tag';
import { AbstractDatabase } from './AbstractDatabase';

const version = 2;

interface OpskriftBlogDb extends DBSchema {
    opskrifter: {
        key: string;
        value: Opskrift
    };

    tags: {
        key: string;
        value: Tag;
    }

    ingredienser: {
        key: string;
        value: Ingrediens;
    }
}

let db: IDBPDatabase<OpskriftBlogDb> | undefined;

export class BrowserDatabase extends AbstractDatabase {


    async initialize() {
        if (db != null)
            return;
        db = await openDB<OpskriftBlogDb>('opskrift-blog', version, {
            upgrade(db) {
                db.createObjectStore('opskrifter');
                db.createObjectStore('tags');
                db.createObjectStore('ingredienser');
            },
        });
    }

    async getOpskrifter(): Promise<Opskrift[]> {
        const opskrifter = await db?.getAll('opskrifter');
        return opskrifter ?? [];
    }

    async getOpskrift(id: string): Promise<Opskrift | undefined> {
        return db?.get('opskrifter', id);
    }

    async putOpskrift(opskrift: Opskrift) {
        if (db == null)
            return;
        await db.put('opskrifter', opskrift, opskrift.id);
    }

    async removeOpskrift(id: string) {
        return db?.delete('opskrifter', id);
    }

    async getTags(): Promise<Tag[]> {
        const tags = await db?.getAll('tags');
        return tags ?? [];
    }

    async getTag(tag: string): Promise<Tag | undefined> {
        return db?.get('tags', tag);
    }

    async putTag(tag: Tag): Promise<void> {
        if (db == null)
            return;
        await db.put('tags', tag, tag.tag);
    }

    async removeTag(tag: string): Promise<void> {
        return db?.delete('tags', tag);
    }


    async getIngredienser(): Promise<Ingrediens[]> {
        const tags = await db?.getAll('ingredienser');
        return tags ?? [];
    }

    async getIngrediens(name: string): Promise<Ingrediens | undefined> {
        return db?.get('ingredienser', name);
    }

    async putIngrediens(ingrediens: Ingrediens): Promise<void> {
        if (db == null)
            return;
        await db.put('ingredienser', ingrediens, ingrediens.name);
    }

    async removeIngrediens(name: string): Promise<void> {
        return db?.delete('ingredienser', name);
    }

}
