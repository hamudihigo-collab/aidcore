export const successResponse = (res, data, message, statusCode = 200) => {
    res.status(statusCode).json({
        status: 'success',
        message,
        data,
    });
};

export const errorResponse = (res, error, statusCode = 500) => {
    const message = error.message || 'An error occurred';
    res.status(statusCode).json({
        status: 'error',
        message,
        error: process.env.NODE_ENV === 'development' ? error : {},
    });
};

export const validationErrorResponse = (res, errors) => {
    res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: errors.array ? errors.array() : errors,
    });
};

export const paginatedResponse = (res, data, totalItems, page, pageSize, message = 'Data retrieved successfully') => {
    const totalPages = Math.ceil(totalItems / pageSize);
    res.status(200).json({
        status: 'success',
        message,
        data,
        pagination: {
            totalItems,
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            totalPages,
        },
    });
};
