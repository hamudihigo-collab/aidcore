export const USER_ROLES = {
    ADMIN: 'admin',
    CASE_MANAGER: 'case_manager',
    REVIEWER: 'reviewer',
    VIEWER: 'viewer',
};

export const CASE_STATUS = {
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    ON_HOLD: 'on_hold',
    CLOSED: 'closed',
    RESOLVED: 'resolved',
};

export const CASE_PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent',
};

export const APPLICATION_STATUS = {
    DRAFT: 'draft',
    SUBMITTED: 'submitted',
    UNDER_REVIEW: 'under_review',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    PENDING_DOCUMENTS: 'pending_documents',
};

export const DOCUMENT_TYPES = {
    ID: 'id',
    PASSPORT: 'passport',
    MEDICAL_REPORT: 'medical_report',
    BIRTH_CERTIFICATE: 'birth_certificate',
    SCHOOL_RECORD: 'school_record',
    PROOF_OF_ADDRESS: 'proof_of_address',
    OTHER: 'other',
};

export const RESPONSE_MESSAGES = {
    SUCCESS: 'Operation completed successfully',
    ERROR: 'An error occurred',
    UNAUTHORIZED: 'Unauthorized access',
    NOT_FOUND: 'Resource not found',
    CONFLICT: 'Resource already exists',
    VALIDATION_ERROR: 'Validation error',
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500,
};
