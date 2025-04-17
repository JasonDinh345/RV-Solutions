export function getTodayPST(){
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })).toLocaleDateString('en-CA')
}

export function getDatePST(offsetDays = 0) {
    const now = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
    const date = new Date(now);
    date.setDate(date.getDate() + offsetDays);
    return date.toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
  }