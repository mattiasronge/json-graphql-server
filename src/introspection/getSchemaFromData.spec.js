import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';
import getSchemaFromData from './getSchemaFromData';

const data = {
    posts: [
        {
            id: 1,
            title: 'Lorem Ipsum',
            views: 254,
            user_id: 123,
        },
        {
            id: 2,
            title: 'Sic Dolor amet',
            views: 65,
            user_id: 456,
        },
    ],
    users: [
        {
            id: 123,
            name: 'John Doe',
        },
        {
            id: 456,
            name: 'Jane Doe',
        },
    ],
};

const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        views: { type: new GraphQLNonNull(GraphQLInt) },
        user_id: { type: new GraphQLNonNull(GraphQLID) },
    },
});
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
    },
});

const ListMetadataType = new GraphQLObjectType({
    name: 'ListMetadata',
    fields: {
        count: { type: GraphQLInt },
    },
});

const QueryType = new GraphQLObjectType({ // eslint-disable-line 
    name: 'Query',
    fields: {
        getPost: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
        },
        getPageOfPost: {
            type: new GraphQLList(PostType),
            args: {
                page: { type: GraphQLInt },
                perPage: { type: GraphQLInt },
                sortField: { type: GraphQLString },
                sortOrder: { type: GraphQLString },
                filter: { type: GraphQLString },
            },
        },
        getUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
        },
        getPageOfUser: {
            type: new GraphQLList(UserType),
            args: {
                page: { type: GraphQLInt },
                perPage: { type: GraphQLInt },
                sortField: { type: GraphQLString },
                sortOrder: { type: GraphQLString },
                filter: { type: GraphQLString },
            },
        },
    },
});

test('creates one type per data type', () => {
    const typeMap = getSchemaFromData(data).getTypeMap();
    expect(typeMap['Post'].name).toEqual(PostType.name);
    expect(typeMap['Post'].fields).toEqual(PostType.fields);
    expect(typeMap['User'].name).toEqual(UserType.name);
    expect(typeMap['User'].fields).toEqual(UserType.fields);
});

test('creates three query fields per data type', () => {
    const queries = getSchemaFromData(data).getQueryType().getFields();
    expect(queries['Post'].type.name).toEqual(PostType.name);
    expect(queries['Post'].args).toEqual([
        {
            defaultValue: undefined,
            description: null,
            name: 'id',
            type: new GraphQLNonNull(GraphQLID),
        },
    ]);
    expect(queries['allPosts'].type).toMatchObject(new GraphQLList(PostType));
    expect(queries['allPosts'].args).toEqual([
        {
            defaultValue: undefined,
            description: null,
            name: 'page',
            type: GraphQLInt,
        },
        {
            defaultValue: undefined,
            description: null,
            name: 'perPage',
            type: GraphQLInt,
        },
        {
            defaultValue: undefined,
            description: null,
            name: 'sortField',
            type: GraphQLString,
        },
        {
            defaultValue: undefined,
            description: null,
            name: 'sortOrder',
            type: GraphQLString,
        },
        {
            defaultValue: undefined,
            description: null,
            name: 'filter',
            type: GraphQLString,
        },
    ]);
    expect(queries['_allPostsMeta'].type).toMatchObject(ListMetadataType);

    expect(queries['User'].type.name).toEqual(UserType.name);
    expect(queries['User'].args).toEqual([
        {
            defaultValue: undefined,
            description: null,
            name: 'id',
            type: new GraphQLNonNull(GraphQLID),
        },
    ]);
    expect(queries['allUsers'].type).toMatchObject(new GraphQLList(UserType));
    expect(queries['allUsers'].args).toEqual([
        {
            defaultValue: undefined,
            description: null,
            name: 'page',
            type: GraphQLInt,
        },
        {
            defaultValue: undefined,
            description: null,
            name: 'perPage',
            type: GraphQLInt,
        },
        {
            defaultValue: undefined,
            description: null,
            name: 'sortField',
            type: GraphQLString,
        },
        {
            defaultValue: undefined,
            description: null,
            name: 'sortOrder',
            type: GraphQLString,
        },
        {
            defaultValue: undefined,
            description: null,
            name: 'filter',
            type: GraphQLString,
        },
    ]);
    expect(queries['_allPostsMeta'].type).toMatchObject(ListMetadataType);
});

test('creates three mutation fields per data type', () => {
    const mutations = getSchemaFromData(data).getMutationType().getFields();
    expect(mutations['createPost'].type.name).toEqual(PostType.name);
    expect(mutations['createPost'].args).toEqual([
        {
            name: 'id',
            type: new GraphQLNonNull(GraphQLID),
            defaultValue: undefined,
            description: null,
        },
        {
            name: 'title',
            type: new GraphQLNonNull(GraphQLString),
            defaultValue: undefined,
            description: null,
        },
        {
            name: 'views',
            type: new GraphQLNonNull(GraphQLInt),
            defaultValue: undefined,
            description: null,
        },
        {
            name: 'user_id',
            type: new GraphQLNonNull(GraphQLID),
            defaultValue: undefined,
            description: null,
        },
    ]);
    expect(mutations['updatePost'].type.name).toEqual(PostType.name);
    expect(mutations['updatePost'].args).toEqual([
        {
            name: 'id',
            type: new GraphQLNonNull(GraphQLID),
            defaultValue: undefined,
            description: null,
        },
        {
            name: 'title',
            type: GraphQLString,
            defaultValue: undefined,
            description: null,
        },
        {
            name: 'views',
            type: GraphQLInt,
            defaultValue: undefined,
            description: null,
        },
        {
            name: 'user_id',
            type: GraphQLID,
            defaultValue: undefined,
            description: null,
        },
    ]);
    expect(mutations['removePost'].type.name).toEqual(GraphQLBoolean.name);
    expect(mutations['removePost'].args).toEqual([
        {
            name: 'id',
            type: new GraphQLNonNull(GraphQLID),
            defaultValue: undefined,
            description: null,
        },
    ]);
    expect(mutations['createUser'].type.name).toEqual(UserType.name);
    expect(mutations['createUser'].args).toEqual([
        {
            name: 'id',
            type: new GraphQLNonNull(GraphQLID),
            defaultValue: undefined,
            description: null,
        },
        {
            name: 'name',
            type: new GraphQLNonNull(GraphQLString),
            defaultValue: undefined,
            description: null,
        },
    ]);
    expect(mutations['updateUser'].type.name).toEqual(UserType.name);
    expect(mutations['updateUser'].args).toEqual([
        {
            name: 'id',
            type: new GraphQLNonNull(GraphQLID),
            defaultValue: undefined,
            description: null,
        },
        {
            name: 'name',
            type: GraphQLString,
            defaultValue: undefined,
            description: null,
        },
    ]);
    expect(mutations['removeUser'].type.name).toEqual(GraphQLBoolean.name);
    expect(mutations['removeUser'].args).toEqual([
        {
            defaultValue: undefined,
            description: null,
            name: 'id',
            type: new GraphQLNonNull(GraphQLID),
        },
    ]);
});

test('pluralizes and capitalizes correctly', () => {
    const data = {
        foot: [{ id: 1, size: 42 }, { id: 2, size: 39 }],
        categories: [{ id: 1, name: 'foo' }],
    };
    const queries = getSchemaFromData(data).getQueryType().getFields();
    expect(queries).toHaveProperty('Foot');
    expect(queries).toHaveProperty('Category');
    expect(queries).toHaveProperty('allFeet');
    expect(queries).toHaveProperty('allCategories');
    const types = getSchemaFromData(data).getTypeMap();
    expect(types).toHaveProperty('Foot');
    expect(types).toHaveProperty('Category');
});
