export interface RV{
    make: String,
    model: String,
    sizeClass : String,
    description: String,
    costToRent : Number,
    vin: String,
    mileage: number,
    isAvailable: Boolean,
    location:String,
    ownerID: Number
    imageID?: Number
}

export interface RVwImage{
    make: String,
    model: String,
    sizeClass : String,
    description: String,
    costToRent : Number,
    vin: String,
    mileage: number,
    isAvailable: Boolean,
    location:String,
    ownerID: Number
    imageURL: String

}