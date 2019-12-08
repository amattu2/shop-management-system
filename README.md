# Introduction
By no stretch of the imagination would I recommend using this Automotive Management Software (AMS, SMS) in a production environment. This product was abandoned and redesigned from the ground up. 

However, if you do consider taking on the responsibility of modernizing this product, see below.

# Installation
- Upload the /data/database.sql file to your MySQL server
- Move the entire directory to your test webserver
- Delete the /data/ directory
- Visit the server 
- Login with the details provided below

Test account information:
> Username: test
> Password: password

# Food For Thought
(Below outline the changes made in V2, plus a plethora of more things)
- Rewrite the frontend codebase to remove the jQuery dependancy.
- Redesign the backend from scratch. The frontend makes several XHR calls per operation (Fetch Customer, Then Fetch Tickets, Then Fetch Vehicles).
- Rebuild the queries to include PDO or MySQLi prepared statements.
- Redesign the table structure. (Normalized) 

# Previews
![preview image](https://github.com/amattu2/vipre-bookings/blob/master/previews/customers-preview.png)
![preview image](https://github.com/amattu2/vipre-bookings/blob/master/previews/dashboard-preview.png)
![preview image](https://github.com/amattu2/vipre-bookings/blob/master/previews/invoice-preview.png)

