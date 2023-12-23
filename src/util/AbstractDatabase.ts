import { Ingrediens } from "../models/Ingrediens";
import { Opskrift } from "../models/Opskrift";
import { Tag } from "../models/Tag";
import { TagStats } from "../models/TagStats";

export abstract class AbstractDatabase {

    abstract initialize(): Promise<void>;

    abstract getOpskrifter(): Promise<Opskrift[]>;

    abstract getOpskrift(id: string): Promise<Opskrift | undefined>;

    async getOpskriftAndRefreshImageTokens(id: string): Promise<Opskrift | undefined> {
        const opskrift = await this.getOpskrift(id);
//        if(opskrift) {
//            opskrift.content = await refreshImageUrlTokens(opskrift.content);
//        }
        return opskrift;
    }

    abstract putOpskrift(opskrift: Opskrift): Promise<void>;

    abstract removeOpskrift(id: string): Promise<void>;

    abstract getTags(): Promise<Tag[]>;

    async getTagsStats(): Promise<TagStats[]> {
        const tags = await this.getTags();
        const opskrifter = await this.getOpskrifter();
        const tagStatss = tags.map(tag => {
            return {...tag, occurrences: opskrifter.filter(o => o.tags.includes(tag.tag)).length};
        });
        tagStatss.sort((a, b) => a.occurrences - b.occurrences);
        return tagStatss;
    }

    abstract getTag(tag: string): Promise<Tag | undefined>;

    abstract putTag(tag: Tag): Promise<void>;

    abstract removeTag(tag: string): Promise<void>;

    abstract getIngredienser(): Promise<Ingrediens[]>;

    abstract getIngrediens(name: string): Promise<Ingrediens | undefined>;

    abstract putIngrediens(ingrediens: Ingrediens): Promise<void>;

    abstract removeIngrediens(name: string): Promise<void>;
}
