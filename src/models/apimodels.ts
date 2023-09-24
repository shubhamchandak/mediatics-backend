export interface ICreateNewUserRequest {
    firstName: string;
    lastName: string;
    email: string;
}

export interface IGetCommentsRequest {
    videoId: string;
    pageNumber: number;
    recordsPerPage: number;
    columnFilters: IColumnFilter[]
}

export interface IColumnFilter {
    field: string;
    values: string[];
}

