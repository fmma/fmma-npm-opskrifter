export function isNullOrEmpty(val: string | null | undefined): boolean {
    return val === '' || val == null;
}

export function singleOrEmpty<T>(condition: boolean, val: () => T): T[] {
    if(condition)
        return [val()];
    return [];
}

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

export function iota(x: number): number[] {
    let result = [];
    for(let i = 0; i < x; ++i) {
        result.push(i);
    }
    return result;
}
