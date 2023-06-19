Create application using express
Connect the app with mongo db
Create different routes to create, update and delete user.
Create a login route and validate user from DB and send JWT Token using JWT package
Create a Middleware function to secure public routes
Following end point created
Get /user  get all user and also check token using middlewear
Post /user create user and also check dublicate email
Delete /user delete user by user id and check token using middlewear
Patch /user update user by user id and check token using middlewear
Post /login create jwt token 
