## Get Current User Profile

Retrieves the authenticated user's profile information. This endpoint returns details about the currently logged-in user based on the provided Bearer token.

---

### Authentication

**Type:** Bearer Token

Include a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <your_token>

 ```

---

### Request Details

| Property | Value |
| --- | --- |
| **Method** | `GET` |
| **URL** | `http://localhost:7000/api/users/me` |

---

### Response

#### Success — `200 OK`

``` json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "69d3bffe79df06caac3b9dbf",
    "name": "Laloo",
    "email": "lalo@gmail.com",
    "role": "admin",
    "phone": "+251912122121",
    "avatar": null,
    "active": true,
    "createdAt": "2026-04-06T14:15:26.166Z",
    "updatedAt": "2026-04-06T14:15:26.166Z",
    "__v": 0
  },
  "statusCode": 200,
  "timestamp": "2026-04-06T14:41:10.648Z"
}

 ```

#### Response Fields

| Field | Type | Description |
| --- | --- | --- |
| `success` | `boolean` | Indicates whether the request was successful |
| `message` | `string` | Human-readable status message |
| `data._id` | `string` | Unique identifier of the user (MongoDB ObjectId) |
| `data.name` | `string` | Full name of the user |
| `data.email` | `string` | Email address of the user |
| `data.role` | `string` | Role assigned to the user (e.g., `admin`, `user`) |
| `data.phone` | `string` | Phone number of the user |
| `data.avatar` | \`string | null\` |
| `data.active` | `boolean` | Whether the user account is currently active |
| `data.createdAt` | `string (ISO 8601)` | Timestamp when the user account was created |
| `data.updatedAt` | `string (ISO 8601)` | Timestamp when the user account was last updated |
| `data.__v` | `number` | Mongoose document version key |
| `statusCode` | `number` | HTTP status code of the response |
| `timestamp` | `string (ISO 8601)` | Server-side timestamp of when the response was generated |

---

### Notes

- This endpoint uses the token to identify the user — no user ID needs to be passed in the URL.
    
- If the token is missing or invalid, the server will return a `401 Unauthorized` error.
    
- The `avatar` field may be `null` if the user has not uploaded a profile picture.
    
- The `role` field can be used to determine access levels within the application.













## Update Authenticated User Profile

Updates the profile information of the currently authenticated user. This endpoint allows users to modify their `name`, `email`, and `role` fields.

---

### Authentication

This endpoint requires a valid **Bearer JWT token** in the `Authorization` header.

```
Authorization: Bearer <JWT token>

 ```

---

### Request

**Method:** `PUT`  
**URL:** `{{global}}/users/me`

#### Request Body

Send a JSON object with one or more of the following fields:

| Field | Type | Description |
| --- | --- | --- |
| `name` | string | The updated display name of the user |
| `email` | string | The updated email address of the user |
| `role` | string | The updated role of the user (e.g., `Provider`, `admin`) |

**Example:**

``` json
{
  "name": "Laloo",
  "email": "lalo@gmail.com",
  "role": "Provider"
}

 ```

---

### Response

#### `200 OK` — Profile updated successfully

Returns a success flag, a confirmation message, and the full updated user object.

``` json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "69d3bffe79df06caac3b9dbf",
    "name": "Laloo",
    "email": "lalo@gmail.com",
    "role": "admin",
    "phone": "+251912122121",
    "avatar": null,
    "active": true,
    "createdAt": "2026-04-06T14:15:26.166Z",
    "updatedAt": "2026-04-06T14:45:34.221Z",
    "__v": 0
  },
  "statusCode": 200,
  "timestamp": "2026-04-06T14:45:34.552Z"
}

 ```

#### Response Fields

| Field | Type | Description |
| --- | --- | --- |
| `success` | boolean | Indicates whether the operation was successful |
| `message` | string | Human-readable status message |
| `data._id` | string | Unique identifier of the user |
| `data.name` | string | Updated name of the user |
| `data.email` | string | Updated email address of the user |
| `data.role` | string | Current role assigned to the user |
| `data.phone` | string | Phone number associated with the account |
| `data.avatar` | string | null | URL to the user's avatar image, or `null` if not set |
| `data.active` | boolean | Whether the user account is currently active |
| `data.createdAt` | string | ISO 8601 timestamp of when the account was created |
| `data.updatedAt` | string | ISO 8601 timestamp of the most recent update |
| `statusCode` | integer | HTTP status code of the response |
| `timestamp` | string | ISO 8601 timestamp of when the response was generated |


## Delete Authenticated User Account

Permanently deletes the account of the currently authenticated user. Once deleted, the account and all associated data cannot be recovered.

**Endpoint:** `DELETE {{global}}/users/me`

---

### Authentication

| Type | Header | Format |
| --- | --- | --- |
| Bearer Token | `Authorization` | `Bearer` |

A valid JWT access token must be provided in the `Authorization` header. The token identifies the user whose account will be deleted.

---

### Request Body

This endpoint does not require a request body.

---

### Response

#### Success — `200 OK`

``` json
{
  "success": true,
  "message": "Your account has been deleted successfully",
  "data": null,
  "statusCode": 200,
  "timestamp": "2026-04-06T14:47:26.861Z"
}

 ```

| Field | Type | Description |
| --- | --- | --- |
| `success` | boolean | Indicates whether the operation was successful |
| `message` | string | Human-readable confirmation message |
| `data` | null | No data is returned on deletion |
| `statusCode` | number | HTTP status code |
| `timestamp` | string | ISO 8601 timestamp of when the action was performed |

---

### Error Responses

| Status Code | Description |
| --- | --- |
| `401 Unauthorized` | Missing or invalid Bearer token |
| `403 Forbidden` | Token does not have permission to delete this account |
| `404 Not Found` | User account not found |
| `500 Internal Server Error` | Unexpected server error |

---

### Notes

- This action is **irreversible**. The user account and all related data will be permanently removed.
    
- After a successful deletion, the provided token will no longer be valid.
    
- Only the authenticated user can delete their own account via this endpoint.
