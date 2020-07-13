const graphql = require('graphql');
const Book = require('../../models/book');
const Author = require('../../models/author');
const User = require("../../models/user")
const Service = require("../../models/service")
const Contract = require("../../models/contract")
const { BookType, AuthorType, UserType, ServiceType, ContractType} = require("../types/types")

const {
    GraphQLObjectType, GraphQLString,
    GraphQLID, GraphQLInt, GraphQLSchema,
    GraphQLList, GraphQLNonNull, GraphQLFloat
} = graphql;

//RootQuery describe how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular 
//book or get a particular author.
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            //argument passed by the user while making the query
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //Here we define how to get data from database source

                //this will return the book with id passed in argument 
                //by the user
                return Book.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({});
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Author.findById(args.id);
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find({});
            }
        },
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return User.findById(args.id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                const users = User.find().exec();
                if (!users) {
                    throw new Error('Error')
                }
                return users
            }
        },
        services: {
            type: new GraphQLList(ServiceType),
            resolve(parent, args) {
                const services = Service.find().exec();
                if (!services) {
                    throw new Error('Error')
                }
                return services
            }
        },
        contract: {
            type: ContractType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Contract.findById(args.id);
            }
        },
        contracts: {
            type: new GraphQLList(ContractType),
            resolve(parent, args) {
                const contracts = Contract.find().exec();
                if (!contracts) {
                    throw new Error('Error')
                }
                return contracts
            }
        },
    }
});

//Very similar to RootQuery helps user to add/update to the database.
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                //GraphQLNonNull make these field required
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                pages: { type: new GraphQLNonNull(GraphQLInt) },
                authorID: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    pages: args.pages,
                    authorID: args.authorID
                })
                return book.save()
            }
        },
        addUser: {
            type: UserType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                phone_number: { type: new GraphQLNonNull(GraphQLString) },
                direction: { type: GraphQLString },
                password: { type: new GraphQLNonNull(GraphQLString) },
                typeID: { type: GraphQLString }
            },
            resolve(parent, args) {
                if (args.name == "") {
                    throw 'Campo requerido vacio';
                }
                let user = new User({
                    name: args.name,
                    age: args.age,
                    email: args.email,
                    phone_number: args.phone_number,
                    direction: args.direction,
                    password: args.password,
                    active: true,
                    rating: 0,
                    typeID: args.typeID,
                    created: Date.now(),
                    updated_date: Date.now(),
                });
                return user.save();
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: {
                    name: 'id',
                    type: new GraphQLNonNull(GraphQLString)
                },
                name: { type: GraphQLString },
                age: { type: GraphQLString },
                email: { type: GraphQLString },
                phone_number: { type: GraphQLString },
                direction: { type: GraphQLString },
                password: { type: GraphQLString },
                typeID: { type: GraphQLString }
            },
            resolve(root, args) {
                return User.findByIdAndUpdate(args.id, { 
                    name: args.name,
                    age: args.age,
                    email: args.email,
                    phone_number: args.phone_number,
                    direction: args.direction,
                    password: args.password,
                    typeID: args.typeID,
                    updated_date: Date.now(),
                }, function (err) {
                    if (err) return next(err);
                });
            }
        },
        removeUser: {
            type: UserType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve(root, params) {
                const user = User.findByIdAndRemove(params.id).exec();
                if (!user) {
                    throw new Error('Error')
                }
                return user;
            }
        },
        addUserService: {
            type: ServiceType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                userID: { type: new GraphQLNonNull(GraphQLString) },
                categoryID: { type: new GraphQLNonNull(GraphQLInt) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: GraphQLNonNull(GraphQLFloat) }
            },
            resolve(parent, args) {
                if (args.name == "" || args.categoryID == "" || args.userID == "") {
                    throw 'Campo requerido vacio';
                }
                let service = new Service({
                    name: args.name,
                    userID: args.userID,
                    categoryID: args.categoryID,
                    description: args.description,
                    price: args.price,
                    active: true,
                    created: Date.now(),
                    updated_date: Date.now(),
                });
                return service.save();
            }
        },
        addContract: {
            type: ContractType,
            args: {
                userID: { type: new GraphQLNonNull(GraphQLString) },
                clientID: { type: new GraphQLNonNull(GraphQLString) },
                serviceID: { type: new GraphQLNonNull(GraphQLString) },
                detail: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: GraphQLNonNull(GraphQLFloat) },
            },
            resolve(parent, args) {
                if (args.clientID == "" || args.userID == "") {
                    throw 'Campo requerido vacio';
                }
                let contract = new Contract({
                    userID: args.userID,
                    clientID: args.clientID,
                    serviceID: args.serviceID,
                    detail: args.detail,
                    price: args.price,
                    state: "CREATED",
                    created: Date.now(),
                    updated_date: Date.now(),
                });
                return contract.save();
            }
        },
        updateContract: {
            type: ContractType,
            args: {
                id: {
                    name: 'id',
                    type: new GraphQLNonNull(GraphQLString)
                },
                serviceID: { type: new GraphQLNonNull(GraphQLString) },
                detail: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: GraphQLNonNull(GraphQLFloat) },
                state: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(root, args) {
                return Contract.findByIdAndUpdate(args.id, { 
                    serviceID: args.serviceID,
                    detail: args.detail,
                    price: args.price,
                    state: args.state,
                    updated_date: Date.now(),
                }, function (err) {
                    if (err) return next(err);
                });
            }
        },
    }
});

//Creating a new GraphQL Schema, with options query which defines query 
//we will allow users to use when they are making request.
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});