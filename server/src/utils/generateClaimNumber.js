import { randomInt } from "crypto";

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const generateClaimNumber = () => {
    const today = new Date();

    const date = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

    let suffix = "";

    for (let i = 0; i < 6; i++) {
        suffix += CHARACTERS[randomInt(CHARACTERS.length)];
    }

    return `CLM-${date}-${suffix}`;
};