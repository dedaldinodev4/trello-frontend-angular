

export interface IColumn {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

export interface IColumnRequest {
    title: string;
    boardId: string;
}