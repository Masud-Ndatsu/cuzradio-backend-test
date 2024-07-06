# API Documentation

This API provides routes for managing users and posts, with authentication and authorization mechanisms in place.

## Table of Contents

-    [User Routes](#user-routes)
     -    [Register User](#register-user)
     -    [Login User](#login-user)
     -    [Get All Users](#get-all-users)
     -    [Get User by ID](#get-user-by-id)
     -    [Update User by ID](#update-user-by-id)
     -    [Delete User by ID](#delete-user-by-id)
-    [Post Routes](#post-routes)
     -    [Create a Post](#create-a-post)
     -    [Get All Posts](#get-all-posts)
     -    [Get Post by ID](#get-post-by-id)
     -    [Update Post by ID](#update-post-by-id)
     -    [Delete Post by ID](#delete-post-by-id)
-    [Authentication and Authorization](#authentication-and-authorization)

## User Routes

### Register User

-    **URL**: `/users/register`
-    **Method**: `POST`
-    **Description**: Registers a new user.
-    **Request Body**:
     ```json
     {
          "firstName": "string",
          "lastName": "string",
          "email": "string",
          "password": "string",
          "roles": [
               {
                    "name": "string",
                    "permissions": ["string"]
               }
          ]
     }
     ```

### Login User

-    **URL**: `/users/login`
-    **Method**: `POST`
-    **Description**: Login a user.
-    **Request Body**:

```json
{
     "email": "string",
     "password": "string"
}
```

-    Responses:
     200 OK: User successfully logged in, returns JWT token.
     401 Unauthorized: Invalid credentials.

### Get All Users

-    **URL**: `/users`
-    **Method**: `GET`
-    **Middleware**: authenticate, checkPermission("viewUsers")
-    **Description**: Login a user.
-    **Request Body**:
-    **Responses**:

```
     200 OK: Users successfully retrieved.
     401 Unauthorized: User not authenticated.
     403 Forbidden: User does not have permission to view users.
```

### Get User by ID

-    **URL**: /users/:id
-    **Method**: GET
-    **Middleware**: authenticate, checkPermission("viewUser")
-    **Description**: Retrieves a user by their ID. -
-    **Responses**:

```
200 OK: User successfully retrieved.
401 Unauthorized: User not authenticated.
403 Forbidden: User does not have permission to view the user.
404 Not Found: User not found.
```

### Update User by ID

**URL**: /users/:id
**Method**: PUT
**Middleware**: authenticate, checkPermission("updateUser")
**Description**: Updates a user by their ID.
**Request Body**:

```json
{
     "firstName": "string",
     "lastName": "string",
     "email": "string",
     "roles": [
          {
               "name": "string",
               "permissions": ["string"]
          }
     ],
     "suspended": "boolean"
}
```

### Delete User by ID

-    **URL**: /users/:id
-    **Method**: DELETE
-    **Middleware**: authenticate, checkPermission("deleteUser")
-    **Description**: Deletes a user by their ID.
-    **Responses**:

     ```
     200 OK: User successfully deleted.
     401 Unauthorized: User not authenticated.
     403 Forbidden: User does not have permission to delete the user.
     404 Not Found: User not found.
     ```

## Post Routes

### Create a Post

-    **URL**: /posts
-    **Method**: POST
-    **Middleware**: authenticate
-    **Description**: Creates a new post.
-    **Request Body**:

```json
{
     "title": "string",
     "content": "string",
     "status": "string",
     "tags": ["string", "string"]
}
```

### Get All Posts

-    **URL**: /posts
-    **Method**: GET
-    **Middleware**: authenticate
-    **Description**: Retrieves all posts.
-    **Responses**:

```
     200 OK: Posts successfully retrieved.
     401 Unauthorized: User not authenticated.
     403 Forbidden: User does not have permission to view posts.
```

### Get Post by ID

-    **URL**: /posts/:id
-    **Method**: GET
-    **Middleware**: authenticate
-    **Description**: Retrieves a post by their ID.
-    **Responses**:

```
200 OK: Post successfully retrieved.
401 Unauthorized: User not authenticated.
403 Forbidden: User does not have permission to view the post.
404 Not Found: Post not found.
```

### Update Post by ID

-    **URL**: /posts/:id
-    **Method**: PUT
-    **Middleware**: authenticate
-    **Description**: Updates a post by their ID.
-    **Request Body**:

```json
{
     "title": "string",
     "content": "string",
     "status": "string",
     "tags": ["string", "string"]
}
```

-    **Responses**:

```
200 OK: Post successfully updated.
401 Unauthorized: User not authenticated.
403 Forbidden: User does not have permission to update the post.
404 Not Found: Post not found.
```

### Delete Post by ID

-    **URL**: /posts/:id
-    **Method**: DELETE
-    **Middleware**: authenticate
-    **Description**: Deletes a user by their ID.
-    **Responses**:

     ```
     200 OK: Post successfully deleted.
     401 Unauthorized: User not authenticated.
     403 Forbidden: User does not have permission to delete the post.
     404 Not Found: Post not found.
     ```

## Authentication and Authorization

### Authenticate Middleware

-    **Purpose**: Verifies the JWT token provided in the request headers and attaches the user object to the request if the token is valid.
-    **Usage**: Applied to routes that require user authentication.

### Check Permission Middleware

-    **Purpose**: Checks if the authenticated user has the required permissions to access the route.
-    **Usage**: Applied to routes that require specific permissions.

### Permissions

-    **viewUsers**: Allows viewing all users.
-    **viewUser**: Allows viewing a specific user.
-    **viewReports**: Allows viewing of user statics.
-    **updateUser**: Allows updating a user.
-    **suspendUser**: Allows suspending a user.
-    **deleteUser**: Allows deleting a user.
-    **Error Responses**

```
401 Unauthorized: Returned when the user is not authenticated.
403 Forbidden: Returned when the user does not have the required permissions.
404 Not Found: Returned when the requested resource is not found.
```