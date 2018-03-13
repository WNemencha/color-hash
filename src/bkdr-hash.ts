/**
 * BKDR Hash (modified version)
 */
function BKDRHash(str) {
    const seed = 131
    const seed2 = 137
    const MAX_SAFE_INTEGER = Math.floor(9007199254740991 / seed2) // Number.MAX_SAFE_INTEGER == 9007199254740991

    // make hash more sensitive for short string like 'a', 'b', 'c'
    str += 'x';

    let hash = 0
    for(let i = 0; i < str.length; i++) {
        if(hash > MAX_SAFE_INTEGER) {
            hash = Math.floor(hash / seed2);
        }
        hash = hash * seed + str.charCodeAt(i);
    }
    return hash;
}

export default BKDRHash
