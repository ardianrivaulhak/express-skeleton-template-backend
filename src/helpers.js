export const randNumber = (length = 4) => {
    let num = `${0}`;
    let maxNum = ``;
    for (let i = 0; i < length; i++)maxNum = `${maxNum}9`;
    while (num.length < length) {
        num = `${Math.floor(Math.random() * maxNum)}`;
    }
    return num;
}