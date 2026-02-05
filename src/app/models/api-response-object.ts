export interface ApiResponseObject<T> {
    requestSuccessful: boolean;
    responseData: T;
    message: string;
    responseCode: string;
    data: T;
}
