import crypto from "crypto";
import prisma from "../lib/prisma.js";

export const generatePolicyNumber = async () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    let policyNumber;
    let exists = true;
    let retries = 0;

    while (exists && retries < 5) {
        const randomPart = crypto.randomInt(100000, 999999);

        policyNumber = `POL-${date}-${randomPart}`;

        exists = await prisma.policy.findUnique({
            where: {
                policyNumber,
            },
            select: {
                id: true,
            },
        });

        retries++;
    }

    if (exists) {
        throw new Error(
            "Unable to generate a unique policy number. Please try again."
        );
    }

    return policyNumber;
};