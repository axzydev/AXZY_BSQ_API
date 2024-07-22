export interface TResult<T> {
    data: T;
    message: string[];
    success: boolean;
}