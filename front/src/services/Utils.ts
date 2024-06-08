export const isEmail = (value: string|undefined) => {
    if(value === undefined)
        return false;

    return value.match(/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/);
}

export const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}