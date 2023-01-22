---

# ABANDONED PROJECT

This project is abandoned. It has awful code and should not be used. It's left here simply because someone might want to use it as a boilerplate for a complete rework. This project was an early evolution to [amattu2/automotive-management-system](https://github.com/amattu2/automotive-management-system). Because the project was rewritten almost entirely, a fork was created and this project sits abandoned. No development on this repository will occur, and I certainly would not recommend using it in a production environment without rewriting most of it.

---

# Installation

1. Upload and import the `/data/database.sql` file to your MySQL server
2. Move the entire directory to your test webserver
3. Delete the /data/ directory
4. Visit the website  
5. Login with the details provided below

Test account information:
> Username: test
>
> Password: password

# Food For Thought

In the event that you want to take on this project, a few of the changes made to "v2" were:

- Rewrite the frontend codebase to remove the jQuery dependency
- Redesign the backend
- Rebuild the queries to use PDO or MySQLi prepared statements.
- Normalize the database

# Previews

![preview image](/previews/customers-preview.png)
![preview image](/previews/dashboard-preview.png)
![preview image](/previews/invoice-preview.png)

