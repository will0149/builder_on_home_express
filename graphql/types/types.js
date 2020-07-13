const graphql = require('graphql');
const Book = require('../../models/book');
const Author = require('../../models/author');
const User = require("../../models/user")
const Service = require("../../models/service");
const Contract = require("../../models/contract")
const GraphQLDate = require('graphql-date');
const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt, 
    GraphQLList, GraphQLBoolean, GraphQLFloat
} = graphql;
//Schema defines data on the Graph like object types(book type), relation between 
//these object types and describes how it can reach into the graph to interact with 
//the data to retrieve or mutate the data   

const BookType = new GraphQLObjectType({
    name: 'Book',
    //We are wrapping fields in the function as we dont want to execute this ultil 
    //everything is inilized. For example below code will throw error AuthorType not 
    //found if not wrapped in a function
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString }, 
        pages: { type: GraphQLInt },
        author: {
        type: AuthorType,
        resolve(parent, args) {
            return Author.findById(parent.authorID);
        }
    }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        book:{
            type: new GraphQLList(BookType),
            resolve(parent,args){
                return Book.find({ authorID: parent.id });
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    //We are wrapping fields in the function as we dont want to execute this ultil 
    //everything is inilized. For example below code will throw error AuthorType not 
    //found if not wrapped in a function
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone_number: { type: GraphQLString },
        direction: { type: GraphQLString },
        password: { type: GraphQLString },
        active: { type: GraphQLBoolean },
        rating: { type: GraphQLInt },
        type: { type: GraphQLInt },
        created: { type: GraphQLDate },
        updated_date: {
            type: GraphQLDate
        },
        service:{
            type: new GraphQLList(ServiceType),
            resolve(parent,args){
                return Service.find({ userID: parent.id });
            }
        }
    })
});

const ServiceType = new GraphQLObjectType({
    name: 'Service',
    //We are wrapping fields in the function as we dont want to execute this ultil 
    //everything is inilized. For example below code will throw error AuthorType not 
    //found if not wrapped in a function
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString },
        userID: { type: GraphQLString },
        categoryID: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
        active: { type: GraphQLString },
        created: { type: GraphQLDate },
        updated_date: {
            type: GraphQLDate
        },
        worker: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userID);
            }
        }
    })
});

const ContractType = new GraphQLObjectType({
    name: 'Contract',
    //We are wrapping fields in the function as we dont want to execute this ultil 
    //everything is inilized. For example below code will throw error AuthorType not 
    //found if not wrapped in a function
    fields: () => ({
        id: { type: GraphQLID  },
        userID: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userID);
            }
        },
        clientID: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.clientID);
            }
        },
        serviceID: {
            type: ServiceType,
            resolve(parent, args) {
                return Service.findById(parent.serviceID);
            }
        },
        detail: { type: GraphQLString },
        price: { type: GraphQLFloat },
        created: { type: GraphQLDate },
        updated_date: {
            type: GraphQLDate
        },
    })
});

module.exports.BookType = BookType;
module.exports.AuthorType = AuthorType;
module.exports.UserType = UserType;
module.exports.ServiceType = ServiceType;
module.exports.ContractType = ContractType