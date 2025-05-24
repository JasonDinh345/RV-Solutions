export interface DamageReport{
    Damages: string,
    Deduction: number,
    Description: string,
    PoliceReportID: string,
    readonly ReportID: number, // primary key
    IncidentNum: string,
    BookingID: number

}
export interface DamageReportwRV{
    Damages: string,
    Deduction: number,
    Description: string,
    PoliceReportID: string,
    Make: string,
    Model: string,
    VIN: string,
    SmallImageURL: string,
    readonly ReportID: number, // primary key
    IncidentNum: string,
    BookingID: number

}