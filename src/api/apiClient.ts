import axios, { AxiosError } from "axios";
import { config } from "../config";
import { Result, ResultData } from "./result";

export type TicketSeverity = {
    id: string,
    code: string,
    name: string,
}

type ResponseBase = {
    success: boolean
    message: string
}

type ResponseListBase<TData> = ResponseBase & {
    items: TData
    hasMore: boolean
    totalCount: number
}

export type TicketData = {
    title: string,
    description: string,
    ticketSeverity: string,
}

export class ApiClient {
    public static async getTicketSeverityList(): Promise<ResultData<TicketSeverity[]>> {
        try {
            const data = await axios.get<ResponseListBase<TicketSeverity[]>>(config.apiUrl + '/ticket-severity',
                {
                    headers: { 'jv-api-key': config.apiKey },
                });
            
            if (data.data?.success) {
                return { data: data.data.items };
            }

            return { data: [], error: data.data.message };
        }
        catch (error) {
            return { data: [], error: processRequestError(error) };
        }
    }

    public static async sendTicket(data: TicketData): Promise<Result> {
        try {
            await axios.post<ResponseBase>(config.apiUrl + '/ticket',
                data,
                {
                    headers: { 'jv-api-key': config.apiKey }
                }
            );

            return { error: undefined };
        }
        catch (error) {
            return { error: processRequestError(error) };
        }
    }
}

function processRequestError(error: unknown | AxiosError): string {
    console.error(error);

    if (axios.isAxiosError(error)) {
        const err = error as AxiosError;
        return err.message;
    }

    return (error as any)?.message;
}