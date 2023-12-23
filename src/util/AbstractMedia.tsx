export abstract class AbstractMedia {
    abstract putMedia(id: string, mediaObject: Blob | File): Promise<string>;
}
