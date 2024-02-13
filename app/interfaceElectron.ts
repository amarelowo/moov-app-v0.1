

declare global {
    interface UpdatedProduct {
        id: number;
        quantity: number;
    }

    interface UpdatedStock {
        [key: number]: UpdatedProduct
    }

    type StockDataCallback = (stockData: any) => void


    interface Window {
        electron: {
            sendData: (data: string) => void
            receive: (channel: string, func: (...args: any[]) => void) => void
            updateStorage: (updatedProducts: UpdatedStock) => void
            requestStock: () => void
            onStockData: (func: StockDataCallback) => void
            activityDetection: () => void
            inactivityDetection: () => void
            
        }
    }
}

export {};