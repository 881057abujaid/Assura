import ApiError from "../utils/ApiError.js";
import prisma from "../lib/prisma.js";

import bcrypt from "bcryptjs";

export const customerService = {};

customerService.createCustomer = async (data) => {
    // Destructure the data
    const { email, password, fullName, phone, dob, gender, address, city, state, country, postalCode } = data;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required to create a customer account.");
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new ApiError(409, "User with this email is already registered.");
    }

    if (phone) {
        // Check if phone number already exists
        const existingPhone = await prisma.customer.findUnique({
            where: { phone }
        });
        if (existingPhone) {
            throw new ApiError(409, "Phone number already exists");
        }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const isCompleted = ["phone", "dob", "gender", "address", "city", "state", "country", "postalCode"]
        .every(field => data[field] !== undefined && data[field] !== null && data[field] !== "");

    // Create the customer and user transactionally
    const customer = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                email,
                password: hashedPassword,
                role: "CUSTOMER",
                status: "ACTIVE"
            }
        });

        const createdCustomer = await tx.customer.create({
            data: {
                userId: user.id,
                fullName,
                phone: phone || null,
                dob: dob ? new Date(dob) : null,
                gender: gender || null,
                address: address || null,
                city: city || null,
                state: state || null,
                country: country || null,
                postalCode: postalCode || null,
                profileCompleted: isCompleted,
                profileCompletedAt: isCompleted ? new Date() : null
            }
        });

        return createdCustomer;
    });

    return customer;
};

customerService.getAllCustomers = async () => {
    // Fetch all customers
    const customers = await prisma.customer.findMany({
        where: {
            user: {
                role: "CUSTOMER"
            }
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    status: true,
                },
            },
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

    // Build updateData only with defined (non-undefined) fields to avoid overwriting existing values
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (dob !== undefined) updateData.dob = dob ? new Date(dob) : null;
    if (gender !== undefined) updateData.gender = gender;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (country !== undefined) updateData.country = country;
    if (postalCode !== undefined) updateData.postalCode = postalCode;

    // Merge existing values with the new update to determine profileCompleted
    const merged = { ...existingCustomer, ...updateData };
    const isCompleted = ["phone", "dob", "gender", "address", "city", "state", "country", "postalCode"]
        .every(field => merged[field] !== undefined && merged[field] !== null && merged[field] !== "");

    if (isCompleted) {
        updateData.profileCompleted = true;
        if (!existingCustomer.profileCompleted) {
            updateData.profileCompletedAt = new Date();
        }
    } else {
        updateData.profileCompleted = false;
        updateData.profileCompletedAt = null;
    }

    const updatedCustomer = await prisma.customer.update({
        where: {
            id: customerId,
        },
        data: updateData,
    });

    return updatedCustomer;
};

customerService.completeProfile = async (userId, data) => {
    // Check if customer profile exists for this user
    const existingCustomer = await prisma.customer.findUnique({
        where: {
            userId,
        },
    });

    if (!existingCustomer) {
        throw new ApiError(404, "Customer profile not found for this user.");
    }

    const { phone, dob, gender, address, city, state, country, postalCode } = data;

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

    const updateData = {
        phone,
        dob: dob ? new Date(dob) : undefined,
        gender,
        address,
        city,
        state,
        country,
        postalCode,
    };

    const merged = { ...existingCustomer, ...updateData };
    const isCompleted = ["phone", "dob", "gender", "address", "city", "state", "country", "postalCode"]
        .every(field => merged[field] !== undefined && merged[field] !== null && merged[field] !== "");

    if (isCompleted) {
        updateData.profileCompleted = true;
        if (!existingCustomer.profileCompleted) {
            updateData.profileCompletedAt = new Date();
        }
    }

    const updatedCustomer = await prisma.customer.update({
        where: {
            userId,
        },
        data: updateData,
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

customerService.getMyProfile = async (userId) => {
    const customer = await prisma.customer.findUnique({
        where: { userId },
        include: {
            policies: {
                include: {
                    policyType: true,
                    assignedAgent: { select: { id: true, email: true } },
                    claims: true,
                    premiumPayments: true,
                },
                orderBy: { createdAt: 'desc' },
            },
            documents: {
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!customer) {
        throw new ApiError(404, "Customer profile not found.");
    }

    return customer;
};