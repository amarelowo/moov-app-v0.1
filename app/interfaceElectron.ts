

declare global {
    interface UpdatedProduct {
        id: number;
        quantity: number;
    }

    interface UpdatedStock {
        [key: number]: UpdatedProduct
    }

    interface Window {
        electron: {
            sendData: (data: string) => void
            receive: (channel: string, func: (...args: any[]) => void) => void
            updateStorage: (updatedProducts: UpdatedStock) => void
        }
    }
}

export {};