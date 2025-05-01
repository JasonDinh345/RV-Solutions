export function getTodayPST(){
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })).toLocaleDateString('en-CA')
}

export function getDatePST(offsetDays = 0) {
    const now = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
    const date = new Date(now);
    date.setDate(date.getDate() + offsetDays);
    return date.toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
}

export function reformatDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    
    return `${month}-${day}-${year}`;
}
export function getDayDiff(dateInput1, dateInput2){
    const date1 = new Date(dateInput1);
    const date2 = new Date(dateInput2);
    
    const diff = Math.abs(date1- date2);

    return Math.ceil(diff/(1000*60*60*24))
}
export function getFullYearDiff(startDate, endDate ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    let years = end.getFullYear() - start.getFullYear();
  
   
    if (end.getMonth() < start.getMonth() || (end.getMonth() === start.getMonth() && end.getDate() < start.getDate())) {
      years--;
    }
  
    return years;
  }

 