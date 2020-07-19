const graphql = require('graphql');
const User = require("../../models/user")
const Service = require("../../models/service");
const Contract = require("../../models/contract")
const GraphQLDate = require('graphql-date');
const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt, 
    GraphQLList, GraphQLBoolean, GraphQLFloat
} = graphql;


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone_number: { type: GraphQLString },
        direction: { type: GraphQLString },
        password: { type: GraphQLString },
        active: { type: GraphQLBoolean },
        rating: { type: GraphQLInt },
        type: { type: GraphQLString },
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

const AuthDataType = new GraphQLObjectType({
    name: 'AuthData',
    fields: () => ({
        userId: { type: GraphQLID  },
        token: { type: GraphQLString },
        type: { type: GraphQLString },
        tokenExpiration: { type: GraphQLString },
    })
});

module.exports.UserType = UserType;
module.exports.ServiceType = ServiceType;
module.exports.ContractType = ContractType
module.exports.AuthDataType = AuthDataType