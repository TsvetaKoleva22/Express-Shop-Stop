# Express-Shop-Stop
### Simple Express app with basic functionality

The project is a simple product catalog application created using ExpessJS with Handlebars as the view engine and MongoDB with Mongoose for database. Its design follows the MVC pattern and covers all CRUD operations.

The app consists of users, products and categories. **Guest users** can register and login. **Logged in users** can logout and also create, buy, edit or delete a product. The **Admin** can do all these things and also create new categories. All these functionalities have their own views. 

Each product has a category in which it is specified. Once a product is bought, it is assigned to the buyer and is no longer visible(so that it cannot be bought again). 

Bonus features are searching for a product by part of the product’s name and also viewing all products in a selected category.
