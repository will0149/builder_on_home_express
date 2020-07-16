const graphql = require('graphql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../../models/user")
const Service = require("../../models/service")
const Contract = require("../../models/contract")
const { UserType, ServiceType, ContractType, AuthDataType } = require("../types/types")
//TODO: add isAuth validation to querys and mutations

const {
    GraphQLObjectType, GraphQLString,
    GraphQLID, GraphQLInt, GraphQLSchema,
    GraphQLList, GraphQLNonNull, GraphQLFloat
} = graphql;

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args, req) {
                return User.findById(args.id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args, req) {
                // if (!req.isAuth) {
                //     throw new Error('Unauthenticated!');
                //   }
                const users = User.find().exec();
                if (!users) {
                    throw new Error('Error')
                }
                return users
            }
        },
        services: {
            type: new GraphQLList(ServiceType),
            resolve(parent, args, req) {
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
            resolve(parent, args, req) {
                return Contract.findById(args.id);
            }
        },
        contracts: {
            type: new GraphQLList(ContractType),
            resolve(parent, args, req) {
                const contracts = Contract.find().exec();
                if (!contracts) {
                    throw new Error('Error')
                }
                return contracts
            }
        },
        login: {
            type: AuthDataType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args) {
                try {
                    console.log('arguments' + args.email);
                    {
                        let user = await User.findOne({ email: args.email }).exec();
                        console.log('user ' + user.name);
                        if (!user) {
                            throw new Error('User does not exist!');
                        }
                        const isEqual = await bcrypt.compare(args.password, user.password);
                        if (!isEqual) {
                            throw new Error('Password is incorrect!');
                        }
                        const token = jwt.sign(
                            { userId: user.id, email: user.email },
                            'somesupersecretkey',
                            {
                                expiresIn: '1h'
                            }
                        );
                        return { userId: user.id, token: token, tokenExpiration: 1 };
                    }
                } catch (error) {
                    console.error(error);
                    // expected output: ReferenceError: nonExistentFunction is not defined
                    // Note - error messages will vary depending on browser
                }
            }
        },
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // addAuthor: {
        //     type: AuthorType,
        //     args: {
        //         //GraphQLNonNull make these field required
        //         name: { type: new GraphQLNonNull(GraphQLString) },
        //         age: { type: new GraphQLNonNull(GraphQLInt) }
        //     },
        //     resolve(parent, args) {
        //         let author = new Author({
        //             name: args.name,
        //             age: args.age
        //         });
        //         return author.save();
        //     }
        // },
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
            async resolve(parent, args, req) {
                if (args.name == "") {
                    throw 'Campo requerido vacio';
                }
                const hashedPassword = await bcrypt.hash(args.password, 12);
                let user = new User({
                    name: args.name,
                    age: args.age,
                    email: args.email,
                    phone_number: args.phone_number,
                    direction: args.direction,
                    password: hashedPassword,
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
            async resolve(root, args, req) {
                const hashedPassword = await bcrypt.hash(args.password, 12);
                return User.findByIdAndUpdate(args.id, {
                    name: args.name,
                    age: args.age,
                    email: args.email,
                    phone_number: args.phone_number,
                    direction: args.direction,
                    password: hashedPassword,
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
            resolve(root, params, req) {
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
            resolve(parent, args, req) {
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
            resolve(parent, args, req) {
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
            resolve(root, args, req) {
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