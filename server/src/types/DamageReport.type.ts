export interface DamageReport{
    Damages: string,
    Deduction: number,
    Description: string,
    OoliceReportID: string,
    readonly ReportID: number, // primary key
    IncidentNum: string,
    BookingID: number

}