type Config = {
    apiUrl: string
    apiKey: string
}

export const config: Config = {
    apiUrl: process.env.REACT_APP_JETVEO_API_URL || 'Missing REACT_APP_JETVEO_API_URL env',
    apiKey: process.env.REACT_APP_JETVEO_API_KEY || 'Missing REACT_APP_JETVEO_API_KEY env',
}
