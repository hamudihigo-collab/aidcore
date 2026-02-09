# AIDCORE Backend API Documentation

## Overview

RESTful API for the AIDCORE case management system. Built with Express.js, PostgreSQL, and JWT authentication.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Cases](#cases)
4. [Documents](#documents)
5. [Notes](#notes)
6. [Error Handling](#error-handling)

---

## Authentication

All API endpoints (except `/auth/register` and `/auth/login`) require JWT authentication via the `Authorization` header.

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Tokens

- **Access Token**: Valid for 7 days (configurable)
- **Refresh Token**: Valid for 30 days (configurable)
- Both tokens are returned on successful login/registration

---

## Endpoints

### Authentication

#### POST /api/auth/register

Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "viewer"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

**Validation:**
- Email must be unique and valid
- Password must contain: uppercase, lowercase, number, special char, 8+ chars
- firstName and lastName required

---

#### POST /api/auth/login

Authenticate user and receive tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "rememberMe": false
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Logged in successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "viewer"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

---

#### GET /api/auth/me

Get current authenticated user's profile.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "viewer",
    "phone": "+1234567890"
  }
}
```

---

#### POST /api/auth/logout

Logout user (clear client-side tokens).

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

---

### Cases

#### POST /api/cases

Create a new case. **Requires role:** admin or case_manager

**Request:**
```json
{
  "clientId": 5,
  "title": "Immigration Case - John Smith",
  "description": "Asylum application processing",
  "priority": "high",
  "tags": ["asylum", "urgent"]
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Case created successfully",
  "data": {
    "id": 42,
    "case_number": "CASE-1702841596000-a7x2k9",
    "client_id": 5,
    "case_manager_id": 1,
    "status": "open",
    "priority": "high",
    "title": "Immigration Case - John Smith",
    "description": "Asylum application processing",
    "tags": ["asylum", "urgent"],
    "created_at": "2026-02-09T10:00:00Z",
    "updated_at": "2026-02-09T10:00:00Z"
  }
}
```

---

#### GET /api/cases

Get all cases with pagination and filtering.

**Query Parameters:**
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 10)
- `status`: Filter by status (open, in_progress, on_hold, closed, resolved)
- `priority`: Filter by priority (low, medium, high, urgent)
- `search`: Search in case_number or title

**Request:**
```
GET /api/cases?page=1&pageSize=10&status=open&priority=high
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Cases retrieved successfully",
  "data": [
    {
      "id": 42,
      "case_number": "CASE-1702841596000-a7x2k9",
      "title": "Immigration Case",
      "status": "open",
      "priority": "high",
      "created_at": "2026-02-09T10:00:00Z"
    }
  ],
  "pagination": {
    "totalItems": 25,
    "page": 1,
    "pageSize": 10,
    "totalPages": 3
  }
}
```

---

#### GET /api/cases/:id

Get case by ID.

**Request:**
```
GET /api/cases/42
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": 42,
    "case_number": "CASE-1702841596000-a7x2k9",
    "client_id": 5,
    "case_manager_id": 1,
    "status": "open",
    "priority": "high",
    "title": "Immigration Case - John Smith",
    "description": "Asylum application processing",
    "tags": ["asylum", "urgent"],
    "created_at": "2026-02-09T10:00:00Z",
    "updated_at": "2026-02-09T10:00:00Z"
  }
}
```

---

#### PUT /api/cases/:id

Update case. **Requires role:** admin or case_manager

**Request:**
```json
{
  "status": "in_progress",
  "priority": "urgent",
  "title": "Updated Title"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Case updated successfully",
  "data": {
    "id": 42,
    "status": "in_progress",
    "priority": "urgent",
    "updated_at": "2026-02-09T11:30:00Z"
  }
}
```

---

#### DELETE /api/cases/:id

Delete case (soft delete). **Requires role:** admin or case_manager

**Response (200):**
```json
{
  "status": "success",
  "message": "Case deleted successfully"
}
```

---

#### GET /api/cases/stats/summary

Get case statistics by status.

**Response (200):**
```json
{
  "status": "success",
  "message": "Statistics retrieved successfully",
  "data": [
    { "status": "open", "count": 5 },
    { "status": "in_progress", "count": 3 },
    { "status": "closed", "count": 12 },
    { "status": "resolved", "count": 8 }
  ]
}
```

---

### Documents

#### POST /api/documents

Upload document to case. **Requires role:** admin or case_manager

**Request (multipart/form-data):**
```
Form Fields:
- caseId (required): Case ID
- file (required): File to upload
- documentType (optional): Type of document
- description (optional): Document description
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Document uploaded successfully",
  "data": {
    "id": 15,
    "case_id": 42,
    "document_type": "passport",
    "file_name": "passport_scan.pdf",
    "file_url": "/uploads/42/passport_scan.pdf",
    "file_size": 524288,
    "uploaded_by": 1,
    "description": "Passport scan",
    "uploaded_at": "2026-02-09T10:30:00Z"
  }
}
```

---

#### GET /api/documents/case/:caseId

Get all documents for a case.

**Query Parameters:**
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 20)

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 15,
      "case_id": 42,
      "document_type": "passport",
      "file_name": "passport_scan.pdf",
      "file_url": "/uploads/42/passport_scan.pdf",
      "file_size": 524288,
      "uploaded_at": "2026-02-09T10:30:00Z"
    }
  ],
  "pagination": {
    "totalItems": 3,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1
  }
}
```

---

#### PUT /api/documents/:id

Update document metadata. **Requires role:** admin or case_manager

**Request:**
```json
{
  "documentType": "birth_certificate",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Document updated successfully",
  "data": {
    "id": 15,
    "document_type": "birth_certificate",
    "description": "Updated description",
    "updated_at": "2026-02-09T11:00:00Z"
  }
}
```

---

#### DELETE /api/documents/:id

Delete document. **Requires role:** admin or case_manager

**Response (200):**
```json
{
  "status": "success",
  "message": "Document deleted successfully"
}
```

---

### Notes

#### POST /api/notes

Create a case note.

**Request:**
```json
{
  "caseId": 42,
  "title": "Follow-up Needed",
  "content": "Client needs to provide updated address proof",
  "isPrivate": false
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Note created successfully",
  "data": {
    "id": 8,
    "case_id": 42,
    "user_id": 1,
    "title": "Follow-up Needed",
    "content": "Client needs to provide updated address proof",
    "is_private": false,
    "created_at": "2026-02-09T10:45:00Z",
    "updated_at": "2026-02-09T10:45:00Z"
  }
}
```

---

#### GET /api/notes/case/:caseId

Get all notes for a case.

**Query Parameters:**
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 20)

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 8,
      "case_id": 42,
      "user_id": 1,
      "first_name": "John",
      "last_name": "Manager",
      "title": "Follow-up Needed",
      "content": "Client needs to provide updated address proof",
      "is_private": false,
      "created_at": "2026-02-09T10:45:00Z"
    }
  ],
  "pagination": {
    "totalItems": 5,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1
  }
}
```

---

#### PUT /api/notes/:id

Update note (creator or admin only).

**Request:**
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "isPrivate": true
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Note updated successfully",
  "data": {
    "id": 8,
    "title": "Updated Title",
    "content": "Updated content",
    "is_private": true,
    "updated_at": "2026-02-09T11:15:00Z"
  }
}
```

---

#### DELETE /api/notes/:id

Delete note (creator or admin only).

**Response (200):**
```json
{
  "status": "success",
  "message": "Note deleted successfully"
}
```

---

## Error Handling

### Error Response Format

```json
{
  "status": "error",
  "message": "Error description",
  "error": {} // Only in development
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (e.g., email exists) |
| 500 | Internal Server Error |

### Example Errors

**Missing Required Fields (400):**
```json
{
  "status": "error",
  "message": "Missing required fields"
}
```

**Invalid Token (401):**
```json
{
  "status": "error",
  "message": "Invalid or expired token"
}
```

**User Not Found (404):**
```json
{
  "status": "error",
  "message": "User not found"
}
```

**Email Already Exists (409):**
```json
{
  "status": "error",
  "message": "User with this email already exists"
}
```

---

## Rate Limiting

Currently not implemented. Consider adding for production.

## CORS

Configured to allow requests from `http://localhost:3000` (frontend).

---

**API Version**: 1.0.0  
**Base URL**: `http://localhost:5000/api`
