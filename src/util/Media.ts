
export async function getMediaUrl(id: string): Promise<any> {
    return undefined;
}

export async function putMedia(id: string, mediaObject: any): Promise<{ s3ObjectKey: string }> {
    return { s3ObjectKey: '' };
}

export async function refreshImageUrlTokens(htmlString: string): Promise<string> {
    const r1 = /<img.*src="([^"]*)"/g;
    let m: RegExpExecArray | null = null;
    let result = htmlString;
    do {
        m = r1.exec(htmlString);
        if (m) {
            const src = m[1];
            const r2 = /.*\/public\/([^?]*)?/g;
            const key = r2.exec(src)?.[1];
            if(!key)
                continue;
            const url = await getMediaUrl(decodeURI(key));
            result = result.replace(src, url);
        }
    } while (m);
    return result;
}
