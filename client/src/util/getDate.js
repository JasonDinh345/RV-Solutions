export function getTodayPST(){
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })).toLocaleDateString('en-CA')
}