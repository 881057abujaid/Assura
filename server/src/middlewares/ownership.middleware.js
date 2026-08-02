import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

/**
 * Middleware: authorizeCustomerOwnership
 *
 * Enforces that a CUSTOMER can only access or modify their OWN customer record.
 * ADMIN and AGENT bypass this check — their existing role authorization covers them.
 *
 * Usage: apply after verifyJWT and authorizeRoles on any route that takes /:customerId.
 */
const authorizeCustomerOwnership = async (req, res, next) => {
    try {
        // ADMIN and AGENT are allowed to access any customer — skip ownership check
        if (req.user.role === "ADMIN" || req.user.role === "AGENT") {
            return next();
        }

        // For CUSTOMER role: verify they own the target record
        const { customerId } = req.params;

        if (!customerId) {
            throw new ApiError(400, "Customer ID is required.");
        }

        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
            select: { userId: true },
        });

        if (!customer) {
            throw new ApiError(404, "Customer not found.");
        }

        // Compare the record's owner against the authenticated user
        if (customer.userId !== req.user.id) {
            throw new ApiError(403, "You are not authorized to access this customer's data.");
        }

        next();
    } catch (error) {
        next(error);
    }
};

export default authorizeCustomerOwnership;
