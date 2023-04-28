# Blog-applications
### Models 
- Author Model
```
{ fname: { mandatory}, lname: {mandatory}, title: {mandatory, enum[Mr, Mrs, Miss]}, email: {mandatory, valid email, unique}, password: {mandatory} }
```
- Blogs Model
```
{ title: {mandatory}, content: {mandatory}, authorId: {mandatory, refs to author model}, isDeleted: {boolean, default: false}}
```

### Author APIs /authors
- Create an author - 
  `Endpoint: BASE_URL/authors`

### POST /blogs
- Create a blog document from request body. Get authorId in request body only.
- Make sure the authorId is a valid authorId by checking the author exist in the authors collection.
- Return HTTP status 201 on a succesful blog creation. Also return the blog document. The response should be a JSON object like [this](#successful-response-structure) 


### GET /blogs
 /blogs
 
 
### PUT /blogs/:blogId
- Updates a blog by changing the its title, body, adding tags, adding a subcategory. (Assuming tag and subcategory received in body is need to be added)
- Updates a blog by changing its publish status i.e. adds publishedAt date and set published to true
- Check if the blogId exists (must have isDeleted false). If it doesn't, return an HTTP status 404 with a response body like [this](#error-response-structure)
- Return an HTTP status 200 if updated successfully with a body like [this](#successful-response-structure) 
- Also make sure in the response you return the updated blog document. 

### DELETE /blogs/:blogId
- Check if the blogId exists( and is not deleted). If it does, mark it deleted and return an HTTP status 200 without any response body.
- If the blog document doesn't exist then return an HTTP status of 404 with a body like [this](#error-response-structure) 

- Add authentication and authroisation feature

### POST /login
- Allow an author to login with their email and password. On a successful login attempt return a JWT token contatining the authorId in response body like [this](#Successful-login-Response-structure)
- If the credentials are incorrect return a suitable error message with a valid HTTP status code.



## Run Locally

Clone the project

bash
https://github.com/S123tuti/Blog-applications


switch the branch using this commond

bash
  git checkout master

Then go to src using this commond
  cd src


Run the server first

npx nodemon index.js   OR npm start

