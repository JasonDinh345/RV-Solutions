export interface Booking{
    status: String,
    readonly bookingID: number,
    vin: number,
    startDate: Date,
    endDate: Date,
    totalCost: number,
    accountID: number
}