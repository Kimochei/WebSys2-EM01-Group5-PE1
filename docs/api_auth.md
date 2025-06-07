# API Notes - Auth

API link is at [https://supabase-socmed.vercel.app](https://supabase-socmed.vercel.app)

Documentation originally located at [https://documenter.getpostman.com/view/13930672/2sB2qi8xaM](https://documenter.getpostman.com/view/13930672/2sB2qi8xaM#b3cf8bc8-e4df-4a27-be8d-9b14c959914b)

## **Authentication and User Management**

These routes are used to sign in, register new users, get user information, and set a user's profile picture. All routes except the `/register` and `/sign-in` require a `Bearer Authorization` header.

**GET - Get User Data**

`/user`

Fetches the User Data of the User associated with the `Bearer Authorization` passed to this route.

**AUTHORIZATION** Bearer Token

**Token**

example request (using curl)

```
curl --location '/user'
```

response:

```json
{
  "id": "039b0314-bd40-4730-87d3-ee7c9b012990",
  "created_at": "2025-06-03T06:17:26.945287+00:00",
  "fName": "John",
  "lName": "Smith",
  "email": "example@example.com",
  "profile_picture": "https://xayfvrsyxvwursqxvlwy.supabase.co/storage/v1/object/public/profile-pictures/user/039b0314-bd40-4730-87d3-ee7c9b012990jpg"
}
```

**POST - Sign In**

`/sign-in`

Authenticates a User using the credentials provided. This route returns an Object with property `access_token`. Use this as the `Bearer Authorization` header for succeeding requests to protected routes.

**Body** urlencoded

**email - `example@example.com`**

**password -** `example`

example request (using curl)

```
curl --location '/sign-in' \
--data-urlencode 'email=example@example.com' \
--data-urlencode 'password=example'
```

response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsImtpZCI6ImJQWUJ5TWxCaElwSWVUaE8iLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3hheWZ2cnN5eHZ3dXJzcXh2bHd5LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIwMzliMDMxNC1iZDQwLTQ3MzAtODdkMy1lZTdjOWIwMTI5OTAiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ5MDA3MDUyLCJpYXQiOjE3NDkwMDM0NTIsImVtYWlsIjoiam1kZWxhdmVnYTEwQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJqbWRlbGF2ZWdhMTBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZOYW1lIjoiSm9obiBFbW1hbnVlbCIsImxOYW1lIjoiRGVsYSBWZWdhIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiIwMzliMDMxNC1iZDQwLTQ3MzAtODdkMy1lZTdjOWIwMTI5OTAifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc0OTAwMzQ1Mn1dLCJzZXNzaW9uX2lkIjoiYWJiYzBhNjgtMzE0Yi00MDNlLWFlYmMtMDc0OGU2ZmYzYzMwIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.q-6P4YNdRXblRFgcvs9xFCEAhIlp2GvIndAjMAfRHWM"
}
```

**POST - Register**

`/register`

Registers a new User. All fields must be provided. After registration, the new user is automatically authenticated and will return their internal User data as well as an `access_token` used for succeeding requests to protected routes.

**Body** urlencoded

**email - `example@example.com`**

**fName** - John

**lName** - Smith

**password -** `example`

example request (using curl)

```
curl --location '/register' \
--data-urlencode 'email=example@example.com' \
--data-urlencode 'fName=John' \
--data-urlencode 'lName=Smith' \
--data-urlencode 'password=example'
```

response:

```json
No response
```

**PATCH - Set Profile Picture**

`/user/profile-picture`

Sets the profile picture of the User associated with the `Bearer Authorization` token provided to this route. Accepts any image type with a maximum file size of 5MB. Returns the updated User data.

**AUTHORIZATION** Bearer Token

**Token**

**Body** formdata

**profile**

example request (using curl)

```
curl --location --request PATCH '/user/profile-picture' \
--form 'profile=@"/C:/Users/User/Pictures/profpics/test.png"'
```

response:

```json
[
  {
    "id": "039b0314-bd40-4730-87d3-ee7c9b012990",
    "created_at": "2025-06-03T06:17:26.945287+00:00",
    "fName": "John",
    "lName": "Smith",
    "email": "example@example.com",
    "profile_picture": "https://xayfvrsyxvwursqxvlwy.supabase.co/storage/v1/object/public/profile-pictures/user/039b0314-bd40-4730-87d3-ee7c9b012990png"
  }
]
```