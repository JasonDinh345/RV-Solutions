export interface DamageReport{
    damages: string,
    deduction: number,
    description: string,
    policeReportID: string,
    readonly reportID: number, // primary key
    incidentNum: string,
    bookingID: number

}