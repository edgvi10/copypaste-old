export const base64 = (string) => {
    return {
        encode: () => {
            return Buffer.from(string).toString("base64");
        },
        decode: () => {
            return Buffer.from(string, "base64").toString("ascii");
        }
    }
}