
export interface Registration {
    author: string;
    lastModified: string;
}

export interface Ingredient {
    ingrediensId: string;
    amount: number;
    unit: string;
}

export interface Comment extends Registration {
    text: string
}

export interface Opskrift extends Registration {
    title: string;
    id: string;
    abstract: string;
    content: string;
    complexity: number;
    duration: number;
    durationActive: number;
    persons: number;
    personsLabel: string | undefined;
    tags: string[];
    ingredients: Ingredient[];
    comments: Comment[];
}
