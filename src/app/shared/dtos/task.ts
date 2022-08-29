
export interface ITask {
    id: string;
    title: string;
    description?: string;
    columnId: string;
    boardId: string;
    userId: string;
}

export interface ITaskRequest {
    title: string;
    columnId: string;
    boardId: string;
}