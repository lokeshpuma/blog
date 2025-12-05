# API Testing with cURL Commands

## Base URL
```
http://localhost:3000
```

---

## 1. Sign Up (Create New User)

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Save the token** from the response for subsequent requests.

---

## 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 3. Verify Token

Replace `YOUR_TOKEN_HERE` with the actual token from signup/login.

```bash
curl -X GET http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "message": "Token is valid",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john"
  }
}
```

---

## 4. Get All Blogs (Public - No Auth Required)

```bash
curl -X GET http://localhost:3000/api/blogs
-H "Authorization: Bearer YOUR_TOKEN_HERE" \
```

**Expected Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "My First Blog",
    "content": "This is the content...",
    "author": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## 5. Create Blog (Protected - Requires Auth)

Replace `YOUR_TOKEN_HERE` with the actual token.

```bash
curl -X POST http://localhost:3000/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post. It can be as long as I want."
  }'
```

**Expected Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post. It can be as long as I want.",
  "author": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 6. Update Blog (Protected - Requires Auth)

Replace `YOUR_TOKEN_HERE` with the actual token and `BLOG_ID` with the blog ID.

```bash
curl -X PUT http://localhost:3000/api/blogs/BLOG_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Updated Blog Title",
    "content": "This is the updated content of my blog post."
  }'
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/blogs/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Updated Blog Title",
    "content": "This is the updated content of my blog post."
  }'
```

**Expected Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Updated Blog Title",
  "content": "This is the updated content of my blog post.",
  "author": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T01:00:00.000Z"
}
```

---

## 7. Delete Blog (Protected - Requires Auth)

Replace `YOUR_TOKEN_HERE` with the actual token and `BLOG_ID` with the blog ID.

```bash
curl -X DELETE http://localhost:3000/api/blogs/BLOG_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/blogs/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "message": "Blog deleted successfully"
}
```

---

## Complete Test Flow Example

```bash
# 1. Sign up a new user
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"

# 2. Verify token
curl -X GET http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer $TOKEN"

# 3. Create a blog
curl -X POST http://localhost:3000/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Blog",
    "content": "This is a test blog post"
  }'

# 4. Get all blogs
curl -X GET http://localhost:3000/api/blogs

# 5. Update blog (replace BLOG_ID with actual ID)
curl -X PUT http://localhost:3000/api/blogs/BLOG_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Updated Test Blog",
    "content": "Updated content"
  }'

# 6. Delete blog (replace BLOG_ID with actual ID)
curl -X DELETE http://localhost:3000/api/blogs/BLOG_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## Error Responses

### Invalid Credentials (401)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "wrongpassword"}'
```

**Response:**
```json
{
  "message": "Invalid username or password"
}
```

### Missing Token (401)
```bash
curl -X POST http://localhost:3000/api/blogs \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "content": "Test"}'
```

**Response:**
```json
{
  "message": "Access token required"
}
```

### Invalid Token (403)
```bash
curl -X GET http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer invalid_token"
```

**Response:**
```json
{
  "message": "Invalid or expired token"
}
```

### Unauthorized Blog Edit/Delete (403)
```bash
# Trying to edit/delete someone else's blog
curl -X PUT http://localhost:3000/api/blogs/SOMEONE_ELSES_BLOG_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title": "Hacked", "content": "Hacked"}'
```

**Response:**
```json
{
  "message": "You can only edit your own blogs"
}
```

---

## Tips

1. **Save your token** after signup/login to use in subsequent requests
2. **Use environment variables** in your shell:
   ```bash
   export TOKEN="your-token-here"
   curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/blogs
   ```
3. **Pretty print JSON** responses by piping to `jq`:
   ```bash
   curl ... | jq
   ```
4. **View response headers** with `-i` flag:
   ```bash
   curl -i -X GET http://localhost:3000/api/blogs
   ```

