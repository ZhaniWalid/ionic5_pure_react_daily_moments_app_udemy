// function formatDate(isoStringDate) {
export const formatDate = (isoStringDate: any) => { // This is the same func also but with arrows (=>) way (ES6)
    return new Date(isoStringDate).toLocaleDateString('en-US', {
        day: 'numeric', month: 'short', year: 'numeric'
    });
};