export const bufferToString = (buffer, encoding = "ascii") => {
    return Buffer.from(buffer).toString(encoding);
};
