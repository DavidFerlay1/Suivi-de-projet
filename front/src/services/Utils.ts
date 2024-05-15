export const isEmail = (value: string|undefined) => {
    if(value === undefined)
        return false;

    return value.match(/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/);
}