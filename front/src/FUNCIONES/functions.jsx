

function SortArray(x, y) {
   
    if (x.toLowerCase() < y.toLowerCase()) { return -1; }
    if (x.toLowerCase() > y.toLowerCase()) { return 1; }
    return 0;

}

export function ordenar(arr){
    return arr.sort(SortArray)
}