## Register

Creates a new user account in the system.

**Endpoint:** `POST http://localhost:7000/api/auth/register`

---

### Request Body

| Field    | Type   | Required | Description                                                 |
| -------- | ------ | -------- | ----------------------------------------------------------- |
| name     | string | Yes      | Full name of the user                                       |
| email    | string | Yes      | Valid email address of the user                             |
| password | string | Yes      | Password (must contain uppercase, lowercase, and digits)    |
| role     | string | Yes      | Role assigned to the user (e.g. `admin`, `user`)            |
| phone    | string | Yes      | Phone number in international format (e.g. `+251912122121`) |

**Example Request Body:**

```json
{
  "name": "Laloo",
  "email": "lalo@gmail.com",
  "password": "1234Abcd",
  "role": "admin",
  "phone": "+251912122121"
}
```

---

### Response

**Status:** `201 Created`

Returns the newly created user object along with `accessToken` and `refreshToken` JWTs.

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "69d3bffe79df06caac3b9dbf",
      "name": "Laloo",
      "email": "lalo@gmail.com",
      "role": "admin",
      "phone": "+251912122121",
      "avatar": null,
      "active": true,
      "createdAt": "2026-04-06T14:15:26.166Z"
    },
    "accessToken": "<JWT>",
    "refreshToken": "<JWT>"
  },
  "statusCode": 201,
  "timestamp": "2026-04-06T14:15:26.977Z"
}
```

---

### Notes

- The `accessToken` should be used as a Bearer token in the `Authorization` header for authenticated requests.
- Store the `refreshToken` securely to obtain new access tokens when the current one expires.

## Login

Authenticates an existing user and returns access and refresh tokens.

**Endpoint:** `POST http://localhost:7000/api/auth/login`

---

### Request Body

| Field    | Type   | Required | Description                          |
| -------- | ------ | -------- | ------------------------------------ |
| email    | string | Yes      | Registered email address of the user |
| password | string | Yes      | Account password                     |

**Example Request Body:**

```json
{
  "email": "lalo@gmail.com",
  "password": "1234Abcd"
}
```

---

### Response

**Status:** `200 OK`

Returns the authenticated user's profile along with `accessToken` and `refreshToken` JWTs.

```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "id": "69d3bffe79df06caac3b9dbf",
      "name": "Laloo",
      "email": "lalo@gmail.com",
      "role": "admin",
      "phone": "+251912122121",
      "avatar": null,
      "active": true,
      "createdAt": "2026-04-06T14:15:26.166Z"
    },
    "accessToken": "<JWT>",
    "refreshToken": "<JWT>"
  },
  "statusCode": 200,
  "timestamp": "2026-04-06T14:18:10.861Z"
}
```

---

### Notes

- Use the returned `accessToken` as a Bearer token in the `Authorization` header for all authenticated requests.
- If the `accessToken` expires, use the `refreshToken` to obtain a new one without requiring the user to log in again.
- Returns `401 Unauthorized` if the credentials are invalid.

## Logout

Logs out the authenticated user by invalidating their refresh token.
**Endpoint:** `POST http://localhost:7000/api/auth/logout`

````{
    "success": true,
    "message": "Logged out successfully",
    "data": null,
    "statusCode": 200,
    "timestamp": "2026-04-06T14:24:53.126Z"
}```

````
