export interface RV{
    Make: string,
    Model: string,
    SizeClass : string,
    Description: string,
    CostToRent : Number,
    readonly VIN: string,
    Mileage: number,
    isAvailable: Boolean,
    City:string,
    State:string,
    OwnerID: number

}

export interface RVwImage{
    Make: string,
    Model: string,
    SizeClass : string,
    Description: string,
    CostToRent : Number,
    readonly VIN: string,
    Mileage: number,
    isAvailable: Boolean,
    City:string,
    State:string,
    OwnerID: number
    imageURL: String

}
export interface SearchOptions{
    City? : string,
    State?: string,
    SizeClass?: string
    AccountID?:string
}