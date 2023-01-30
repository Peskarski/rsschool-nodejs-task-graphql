import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLOutputType,
  GraphQLInputObjectType,
  GraphQLNonNull
} from 'graphql';

const User: GraphQLOutputType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    userSubscribedTo: {
      type: new GraphQLList(User),
      async resolve(user, _, fastify) {
        return await fastify.db.users.findMany({ key: 'subscribedToUserIds', inArray: user.id });
      }
    },
    subscribedToUser: {
      type: new GraphQLList(User),
      async resolve(user, _, fastify) {
        return user.subscribedToUserIds.map(async (id: string) => {
          return await fastify.db.users.findOne({ key: 'id', equals: id });
        });
      }
    },
    posts: {
      type: new GraphQLList(Post),
      async resolve(user, _, fastify) {
        return await fastify.db.posts.findMany({ key: 'userId', equals: user.id });
      }
    },
    profile: {
      type: Profile,
      async resolve(user, _, fastify) {
        return await fastify.db.profiles.findOne({ key: 'userId', equals: user.id });
      }
    },
    memberType: {
      type: MemberType,
      async resolve(user, _, fastify) {
        const profile = await fastify.db.profiles.findOne({ key: 'userId', equals: user.id });

        if (user.profile === null) {
          return null;
        }

        return await fastify.db.memberTypes.findOne({ key: 'id', equals: profile.memberTypeId });
      }
    }
  }),
});

const Post = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLString },
  }),
});

const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: GraphQLID },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  }),
});

const Profile = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: GraphQLID },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
    userId: { type: GraphQLString },
  }),
});

const CreateUser = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  }
});

const CreatePost = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }
});

const CreateProfile = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
  }
});

const UpdateUser = new GraphQLInputObjectType({
  name: 'UpdateUserInput',
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    id: { type:  new GraphQLNonNull(GraphQLID) },
  }
});

const UpdatePost = new GraphQLInputObjectType({
  name: 'UpdatePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    id: { type: new GraphQLNonNull(GraphQLID) },
  }
});

const UpdateProfile = new GraphQLInputObjectType({
  name: 'UpdateProfileInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
  }
});

const UpdateMemberType = new GraphQLInputObjectType({
  name: 'UpdateMemberTypeInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  }
})

export {
  User,
  Post, 
  MemberType, 
  Profile, 
  CreateUser,
  CreatePost,
  CreateProfile,
  UpdateUser,
  UpdatePost,
  UpdateProfile,
  UpdateMemberType,
};