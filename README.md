# Library-Management-System

    Library Management System by NodeJs 
     implemented using Node.js is a web-based application designed to facilitate the efficient management of library 
     resources,including books, patrons, and related information
## ERD Attachment To Explain the Schma of Database

## Installing App

    $ git clone https://github.com/MeladKarmy/Library-Management-System.git

## Running App

    first install -> NodeJs

    second open terminal  OR cmd

    npm start

## Simple build for production

    npm run start_prod

|  Name                           | Description                              |
|-------------------------------- | -------------------------------------------------|
| **Backend/node_modules**        | Contains all npm                      |
| **Backend/controllers**         | Controllers define functions to serve various express routes.|
| **controllers/middlewareErrore**| middlewares Error which handling Error in development and proudction|
| **Backend/routes**              | Contain all express routes, separated by module/area of application|
| **Backend/Models**              | Models define schemas that will be used in storing and retrieving data from Application database|
| **Backend/Utils**               |classes to use in any where in App such handling throw Error,create file.xlsx,feature to use when get data in controller,
|                                 |                                 handle function to use Async,limitition on request  |
| **Backend/app.js**              | Entry point to express app |
| **Backend/server.js**           | contain all server dependencies|
| **Backend/package.json**        | Contains npm dependencies as well as [build scripts] |
| **config.env**                  | Application configuration including environment-specific configs|


# End POINT (RESTFUL API)

    base path ===> Domain/api/v1/
    all rout with Method get support search in params
    when user borrow book count of books which he have Increases by 1
    and count the book avalibale Decrease by 1
    when user return book count of books Decrease by 1
    and count book avalibale Increases by 1
    -Note limit 3 request in 15 minutes in 
            creat borrow book ,return book

## Authentication & Authurith

    use Session and Cookies HttpOnly and JWT TO Encryption Data

    Rigister path===>/Auth/signin

       Method post(AuthUser.signUp)
    # Data you will send {
    "name":string,
    "email":"string,
    "password":string,
    "gender":string --> enum: ["male", "famale"],
    "Role":string enum: ["user", "admin"]
    }

    login ===> Auth/signin
    Method post(AuthUser.signIn)
    # Data you will send {
    "email":"melad@gmail.com",
    "password":"12345678"
    }
    logout path===> Auth/logout
    Method post(AuthUser.signOut);
    # Data you will send {}

## Books Crud Operation

    get all books ===> books
    post creat book ==> books
    # Data you will send {
        "ISBN": Number,
        "title": string,
        "author": string,
        "quantity": Number,
        "shelfLocation": string
    }
    get spacific book ===> books/:id
    post updat spacific book ===>books/:id
    Delete updat spacific book ===>books/:id

## user Crud Operation

    get all users ===> users
    post creat book ==> users
    # Data you will send {
        "name":string,
        "email":"string,
        "password":string,
        "gender":string --> enum: ["male", "famale"],
        "Role":string enum: ["user", "admin"]
    }

    get spacific book ===> users/:id
    post updat spacific book ===>users/:id
    Delete updat spacific book ===>users/:id

## Borrowin Book Crud Operation

    # Method get
    path checkOutBooks/borrowBook ==>get borrowing book
    path checkOutBooks/borrowBook/:id ==>get spacific borrowing book
    path checkOutBooks/overdueBooks ==>get all overdue Books
    path checkOutBooks/overdueBooks/:id ==>get spacific overdue Books
    path checkOutBooks/returnBook ==>get all returnBook Books
    path checkOutBooks/returnBook/:id ==>get spacific returnBook Books

    # Method post
    path checkOutBooks/borrowBook ===> to creat new borrowing book
    data you will send {
    "ISBN": Number ===> ref to book,
    "userId": ObjectId  ===> with ref to user,
    "dueDate": Number ==> count of days EX ==> 3
    }

    path checkOutBooks/returnBook ===> to Return book
    data you will send
    {
    "ISBN":Number,
    "userId":ObjectId
    }

    # Method Delete
    path checkOutBooks/borrowBook/:id ===> to delete borrowing book

## Analitics Crud Operation

    Method get path ===> analyticals
    #Data ue will send
    {
    "coulamAnalitics":string ====> this is filed name you will need Analitics In borrowbook Mddel,
    "filename":string , ==> name the file xlsx
    "workSheet":"get", ==>name the sheet
    "startDate":"2023-11-10", ===> start date you need
    "endDate":"2023-11-13" ===> end date you need
    }
    overdueBooks last Month
    Method get path ====> checkOutBooks/overdueBooks/lastMonth

    checkOutBooks last Month
    Method get path ====> checkOutBooks/borrowingBooks/lastMonth
