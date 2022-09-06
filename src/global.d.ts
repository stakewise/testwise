declare global {
  interface Window {
    ethereum: {
      request: (data: any) => Promise<any>
      selectedAddress: string
    }
    e2e: {
      requestsQueue: Promise<any>[]
      originalRequest: (data: any) => Promise<any>
      waitForRequestsQueue: () => Promise<void>
    }
  }
}

export {}
