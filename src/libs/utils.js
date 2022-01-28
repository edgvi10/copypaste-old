export const base64 = (string) => {
    return {
        encode: () => {
            return Buffer.from(string, "utf8").toString("base64");
        },
        decode: () => {
            return Buffer.from(string, "base64").toString("utf8");
        }
    }
}