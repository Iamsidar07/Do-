interface Doc {
    _id: string;
    id: string;
    title: string;
    userId?: string;
    data: string;
    createdAt: Date;
    updatedAt: Date;
}

export { Doc }