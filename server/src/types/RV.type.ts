export interface RV{
    make: string,
    model: string,
    sizeClass : string,
    description: string,
    costToRent : Number,
    readonly vin: string,
    mileage: number,
    isAvailable: Boolean,
    location:String,
    ownerID: number

}

export interface RVwImage{
    make: String,
    model: String,
    sizeClass : String,
    description: String,
    costToRent : Number,
    readonly  vin: String,
    mileage: number,
    isAvailable: Boolean,
    location:String,
    ownerID: Number
    imageURL: String

}