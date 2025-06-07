# API Notes - Posts

API link is at [https://supabase-socmed.vercel.app](https://supabase-socmed.vercel.app)

Documentation originally located at [https://documenter.getpostman.com/view/13930672/2sB2qi8xaM](https://documenter.getpostman.com/view/13930672/2sB2qi8xaM#8fa38976-ddfe-4d86-aba6-14bde79101de)

## **Posts**

These routes are used to upload, retrieve, and reply to posts. All routes require a `Bearer Authorization` header.

**GET - Get Posts (Paginated)**

`/post?page=1`

Returns an array of Posts with their Likes and Replies, up to 10 Posts at a time. Provide a `page` query parameter to retrieve the next page (10 items) of Posts. The `replies` property in each post contains only the number of replies.

**AUTHORIZATION** Bearer Token

**Token**

**PARAMS**

**page** 1

example request (using curl)

```
curl --location '/post?page=1'
```

response:

```json
[
  {
    "id": 9,
    "created_at": "2025-06-04T02:19:54.807754+00:00",
    "owned_by": "039b0314-bd40-4730-87d3-ee7c9b012990",
    "content": "Hello from Express!",
    "likes": [
      {
        "count": 0
      }
    ],
    "replies": [
      {
        "count": 0
      }
    ]
  },
  {
    "id": 8,
    "created_at": "2025-06-03T08:39:51.342926+00:00",
    "owned_by": "ce40c799-9fb4-4069-bfe9-d818529b413b",
    "content": "test",
    "likes": [
      {
        "count": 0
      }
    ],
    "replies": [
      {
        "count": 0
      }
    ]
  },
  {
    "id": 6,
    "created_at": "2025-06-02T07:31:05.768934+00:00",
    "owned_by": "ce40c799-9fb4-4069-bfe9-d818529b413b",
    "content": "New post from Express!",
    "likes": [
      {
        "count": 1
      }
    ],
    "replies": [
      {
        "count": 0
      }
    ]
  },
  {
    "id": 5,
    "created_at": "2025-06-02T06:59:29.51605+00:00",
    "owned_by": "ce40c799-9fb4-4069-bfe9-d818529b413b",
    "content": "Hello world from Express!",
    "likes": [
      {
        "count": 0
      }
    ],
    "replies": [
      {
        "count": 1
      }
    ]
  },
  {
    "id": 4,
    "created_at": "2025-06-02T06:58:11.874459+00:00",
    "owned_by": "ce40c799-9fb4-4069-bfe9-d818529b413b",
    "content": "Hello world from Express!",
    "likes": [
      {
        "count": 0
      }
    ],
    "replies": [
      {
        "count": 2
      }
    ]
  }
]
```

**GET - Get Specific Post**

`/post/:id`

Returns a Post and all replies to that Post under the `replies` property. Replies come with information about its author under the `users` property.

**AUTHORIZATION** Bearer Token

**Token**

**PATH VARIABLES**

**id**

example request (using curl)

```
curl --location '/post/9'
```

response:

```json
{
  "id": 9,
  "created_at": "2025-06-04T02:19:54.807754+00:00",
  "owned_by": "039b0314-bd40-4730-87d3-ee7c9b012990",
  "content": "Hello from Express!",
  "replies": []
}
```

**POST - Like Post**

`/post/:id/likes`

This route should be called when a User *likes* a Post. It expects no content, only the `id` of the Post being liked. This route does not return any data when it succeeds (204). If this route is called when the User already liked the Post, a conflict error is returned (409).

**AUTHORIZATION** Bearer Token

**Token**

**PATH VARIABLES**

**id**

example request (using curl)

```
curl --location --request POST '/post/9/likes'
```

response:

```json
No response
```

**DELETE - Unlike Post**

`/post/:id/likes`

This route should be called when a User *unlikes* a Post. It expects no content, only the `id` of the Post being liked. This route does not return any data when it succeeds (204). If this route is called when the User has not liked the Post, a Not Found error is returned (404).

**AUTHORIZATION** Bearer Token

**Token**

**PATH VARIABLES**

**id**

example request (using curl)

```
curl --location --request DELETE '/post/9/likes'
```

response:

```json
No response
```

**POST - Reply to Post**

`/post/:id/replies`

This route should be called when a User replies to a Post. If the provided `id` points to a nonexistent post, a Not Found error is returned. Upon success, this route will return the updated `replies`.

**AUTHORIZATION** Bearer Token

**Token**

**PATH VARIABLES**

**id**

**Body** urlencoded

**content**

example request (using curl)

```
curl --location '/post/9/replies' \
--data-urlencode 'content=This is a reply!'
```

response:

```json
[
  {
    "id": 9,
    "created_at": "2025-06-04T02:30:10.423654+00:00",
    "owned_by": "039b0314-bd40-4730-87d3-ee7c9b012990",
    "thread": 9,
    "content": "This is a reply!"
  }
]
```

**DELETE - Delete Reply from Post**

`/post/:id/replies/:reply_id`

This route should be called when the User deletes a reply from a Post. It expects no content, only the `id` of the Post where the reply is connected to, and the `id` of the reply to delete as `reply_id`. This route returns the deleted reply data.

**AUTHORIZATION -** Bearer Token

**Token**

**PATH VARIABLES**

**id**

**reply_id**

example request (using curl)

```
curl --location --request DELETE '/post/9/replies/9'
```

response:

```json
{
  "id": 9,
  "created_at": "2025-06-04T02:19:54.807754+00:00",
  "owned_by": "039b0314-bd40-4730-87d3-ee7c9b012990",
  "content": "Hello from Express!",
  "replies": []
}
```

**POST - Upload Post**

`/post`

This route should be called when the User uploads a Post. Once uploaded, Posts cannot be deleted.

**AUTHORIZATION** Bearer Token

**Token**

**Body** urlencoded

**content**

example request (using curl)

```
curl --location '/post' \
--data-urlencode 'content=Hello from Express!'
```

response:

```json
[
  {
    "id": 9,
    "created_at": "2025-06-04T02:19:54.807754+00:00",
    "owned_by": "039b0314-bd40-4730-87d3-ee7c9b012990",
    "content": "Hello from Express!"
  }
]
```