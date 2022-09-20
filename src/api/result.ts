export type Result = {
    error?: string
}

export type ResultData<TData> = Result & {
    data: TData
    error?: string
}