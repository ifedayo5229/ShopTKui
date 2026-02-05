export interface ExecutionReportDetailVm {
    comment: string;
    name: string;
    address: string;
    phoneNumber: string;
    quantity: number;
}

export interface LogUsageRequest {
    userId: string;
    requestId: number;
    executionReportDetailVms: ExecutionReportDetailVm[];
}