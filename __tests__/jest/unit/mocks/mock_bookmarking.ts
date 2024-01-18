export const create = async (barcode: string, userid: string) : Promise<number> => {
    return Promise.resolve(Number.parseInt(barcode))
};


export const remove = async (barcode: string, userid: string) : Promise<number> => {
    return Promise.resolve(Number.parseInt(barcode))
};

export const check = async (barcode: string, userid: string) : Promise<boolean> => {
    return Promise.resolve(true)
};