import crypto from "crypto";

const generateTransactionId = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = crypto.randomInt(100000, 999999);
    return `PAY-${date}-${random}`;
};

export default generateTransactionId;