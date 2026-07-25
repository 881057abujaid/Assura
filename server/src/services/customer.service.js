import ApiError from "../utils/ApiError.js";
import prisma from "../lib/prisma.js";

export const customerService = {};

customerService.createCustomer = async (data) => {
    // Destructure the data
    const { userId, fullName, phone, dob, gender, address, city, state, country, postalCode } = data;

    // Check if the user exists
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if the customer already exists
    const existingCustomer = await prisma.customer.findUnique({
        where: {
            userId,
        },
    });

    if (existingCustomer) {
        throw new ApiError(409, "Customer already exists");
    }

    // Check if phone number already exists
    const existingPhone = await prisma.customer.findUnique({
        where: {
            phone,
        },
    });

    if (existingPhone) {
        throw new ApiError(409, "Phone number already exists");
    }

    // Create the customer
    const customer = await prisma.customer.create({
        data: {
            userId,
            fullName,
            phone,
            dob,
            gender,
            address,
            city,
            state,
            country,
            postalCode,
        },
    });

    return customer;
};

customerService.getAllCustomers = async () => {
    // Fetch all customers
    const customers = await prisma.customer.findMany({
        include: {
            user: true
        },
        orderBy: { createdAt: "desc" },
    });

    return customers;
};

customerService.getCustomerById = async (customerId) => {
    // Validate customerId
    if (!customerId) {
        throw new ApiError(400, "Customer ID is required");
    }

    // Fetch the customer
    const customer = await prisma.customer.findUnique({
        where: {
            id: customerId,
        },
    });

    if (!customer) {
        throw new ApiError(404, "Customer not found");
    }

    return customer;
};

customerService.updateCustomer = async (data) => {
    // Destructure the data
    const { customerId, fullName, phone, dob, gender, address, city, state, country, postalCode } = data;

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
        where: {
            id: customerId,
        },
    });

    if (!existingCustomer) {
        throw new ApiError(404, "Customer not found.");
    }

    // Check if phone number updating
    if (phone && phone !== existingCustomer.phone) {
        const existingPhone = await prisma.customer.findUnique({
            where: {
                phone,
            },
        });

        if (existingPhone) {
            throw new ApiError(409, "Phone number already exists");
        }
    }

    // Update the customer
    const updatedCustomer = await prisma.customer.update({
        where: {
            id: customerId,
        },
        data: {
            fullName,
            phone,
            dob,
            gender,
            address,
            city,
            state,
            country,
            postalCode,
        },
    });

    return updatedCustomer;
};

customerService.deleteCustomer = async (customerId) => {
    // Fetch customer
    const customer = await prisma.customer.findUnique({
        where: {
            id: customerId,
        },
        include: {
            policies: true,
            documents: true,
        },
    });

    if (!customer) {
        throw new ApiError(404, "Customer not found.");
    }

    // Check if customer has any policies or documents
    if (customer.policies.length > 0) {
        throw new ApiError(409, "Customer has policies");
    }

    if (customer.documents.length > 0) {
        throw new ApiError(409, "Customer has documents");
    }

    // Delete customer
    const deletedCustomer = await prisma.customer.delete({
        where: {
            id: customerId,
        },
    });

    return deletedCustomer;
};