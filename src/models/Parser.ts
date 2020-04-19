
export type Parser<A> = (input: string) => [A, string][];

export function plazy<A>(p: () => Parser<A>): Parser<A> {
    return input => p()(input);
}

export function pmap<A,B>(f: (x: A) => B, p: Parser<A>): Parser<B> {
    return input => p(input).map(x => [f(x[0]), x[1]]);
}

export function ppure<A>(x: A): Parser<A> {
    return input => [[x, input]];
}

export function papp<A, B>(pf: Parser<(x: A) => B>, px: Parser<A>): Parser<B> {
    return pbind(pf, f => pbind(px, x => ppure(f(x))));
}

export function pzip<A, B>(p1: Parser<A>, p2: Parser<B>): Parser<[A, B]> {
    return papp(pmap(x => y => [x, y], p1), p2);
}

export function pbind<A, B>(p: Parser<A>, f: (x: A) => Parser<B>): Parser<B> {
    return input => p(input).flatMap(x => f(x[0])(x[1]));
}

export function pfail<A>(): Parser<A> {
    return input => [];
}

export function choice<A>(...ps: Parser<A>[]): Parser<A> {
    return input => ps.flatMap(p => p(input));
}

export function biasedChoice<A>(...ps: Parser<A>[]): Parser<A> {
    return input => {
        for(let i = 0; i < ps.length; ++i) {
            const r = ps[i](input);
            if(r.length > 0)
                return r;
        }
        return [];
    };
}

export function many<A>(p: Parser<A>): Parser<A[]> {
    return biasedChoice(many1(p), ppure([]));
}

export function many1<A>(p: Parser<A>): Parser<A[]> {
    return pbind(p, x => pbind(many(p), xs => ppure([x, ...xs])));
}

export function sepBy<A>(sep: Parser<unknown>, p: Parser<A>): Parser<A[]> {
    return biasedChoice(sepBy1(sep, p), ppure([]));
}

export function sepBy1<A>(sep: Parser<unknown>, p: Parser<A>): Parser<A[]> {
    return pbind(p,
        x => pbind(many(pbind(sep, _ => p)),
        xs => ppure([x, ...xs])));
}

export function token(regex: RegExp): Parser<string> {
    return pbind(sat(/^\s*/m), _=>sat(regex));
}

export function sat(regex: RegExp): Parser<string> {
    return input => {
        const result = regex.exec(input);
        if(result?.length) {
            return [[result[0], input.substring(result[0].length)]];
        }
        return [];
    }
}

export function parseBrackeets<A>(ob: RegExp, cb: RegExp, p: Parser<A>): Parser<A> {
    return pbind(token(ob),
        _ => pbind(p,
        x => pbind(token(cb),
        _ => ppure(x))));
}
