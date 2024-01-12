

declare global {
    interface Window {
        electron: {
            sendData: (data: string) => void
            receive: (channel: string, func: (...args: any[]) => void) => void
        }
    }
}

export {};