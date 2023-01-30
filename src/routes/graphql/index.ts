import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  graphql,
  GraphQLID,
  GraphQLNonNull,
} from 'graphql';
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import {
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
} from './types';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
          name: 'BasicQuery',
          fields: {
            users: {
              type: new GraphQLList(User),
              async resolve() {
                return await fastify.db.users.findMany();
              }
            },
            posts: {
              type: new GraphQLList(Post),
              async resolve() {
                return await fastify.db.posts.findMany();
              }
            },
            memberTypes: {
              type: new GraphQLList(MemberType),
              async resolve() {
                return await fastify.db.memberTypes.findMany();
              }
            },
            profiles: {
              type: new GraphQLList(Profile),
              async resolve() {
                return await fastify.db.profiles.findMany();
              }
            },
            user: {
              type: User,
              args: {
                id: { type: GraphQLID }
              },
              async resolve(_, { id }) {
                const user = await fastify.db.users.findOne({ key: 'id', equals: id });

                if (user === null) {
                  throw fastify.httpErrors.notFound('User does not exsist');
                }

                return user;
              }
            },
            post: {
              type: Post,
              args: {
                id: { type: GraphQLID }
              },
              async resolve(_, { id }) {
                const post = await fastify.db.posts.findOne({ key: 'id', equals: id });

                if (post === null) {
                  throw fastify.httpErrors.notFound('Post does not exsist');
                }

                return post;
              }
            },
            profile: {
              type: Profile,
              args: {
                id: { type: GraphQLID }
              },
              async resolve(_, { id }) {
                const profile = await fastify.db.profiles.findOne({ key: 'id', equals: id });

                if (profile === null) {
                  throw fastify.httpErrors.notFound('Post does not exsist');
                }

                return profile;
              }
            },
            memberType: {
              type: MemberType,
              args: {
                id: { type: GraphQLID }
              },
              async resolve(_, { id }) {
                const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: id });

                if (memberType === null) {
                  throw fastify.httpErrors.notFound('Post does not exsist');
                }

                return memberType;
              }
            },
          }
        }),
        mutation: new GraphQLObjectType({
          name: 'BasicMutation',
          fields: {
            createUser: {
              type: User,
              args: {
                user: { type: new GraphQLNonNull(CreateUser) }
              },
              async resolve(_, { user }) {
                const newUser = await fastify.db.users.create(user);

                if (!newUser) {
                  throw fastify.httpErrors.badRequest('User is not created');
                }

                return newUser;
              }
            },
            createPost: {
              type: Post,
              args: {
                post: { type: new GraphQLNonNull(CreatePost) }
              },
              async resolve(_, { post }) {
                const newPost = await fastify.db.posts.create(post);

                if (!newPost) {
                  throw fastify.httpErrors.badRequest('Post is not created');
                }

                return newPost;
              }
            },
            createProfile: {
              type: Profile,
              args: {
                profile: { type: new GraphQLNonNull(CreateProfile) }
              },
              async resolve(_, { profile }) {
                const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: profile.memberTypeId });

                if (memberType === null) {
                  throw fastify.httpErrors.badRequest('Member type was not found');
                }

                const user = await fastify.db.users.findOne({ key: 'id', equals: profile.userId });

                if (!user) {
                  throw fastify.httpErrors.badRequest('User does not exist');
                }

                const userWithProfile = await fastify.db.profiles.findOne({ key: 'userId', equals: profile.userId });

                if (userWithProfile) {
                  throw fastify.httpErrors.badRequest('User already has profile');
                }

                const newProfile = await fastify.db.profiles.create(profile);

                if (!newProfile) {
                  throw fastify.httpErrors.badRequest('Profile is not created');
                }

                return newProfile;
              }
            },
            updateUser: {
              type: User,
              args: {
                user: { type: new GraphQLNonNull(UpdateUser) }
              },
              async resolve(_, { user }) {
                const userToUpdate = await fastify.db.users.findOne({ key: 'id', equals: user.id });

                if (userToUpdate === null) {
                  throw fastify.httpErrors.badRequest('User does not exsist');
                }

                const updatedUser = await fastify.db.users.change(user.id, {
                  ...user,
                });

                return updatedUser;
              }
            },
            updatePost: {
              type: Post,
              args: {
                post: { type: new GraphQLNonNull(UpdatePost) }
              },
              async resolve(_, { post }) {
                const postToUpdate = await fastify.db.posts.findOne({ key: 'id', equals: post.id });

                if (postToUpdate === null) {
                  throw fastify.httpErrors.badRequest('Post does not exsist');
                }

                const updatedPost = await fastify.db.posts.change(post.id, {
                  ...post,
                });

                return updatedPost;
              }
            },
            updateProfile: {
              type: Profile,
              args: {
                profile: { type: new GraphQLNonNull(UpdateProfile) }
              },
              async resolve(_, { profile }) {
                const profileToUpdate = await fastify.db.profiles.findOne({ key: 'id', equals: profile.id });

                if (profileToUpdate === null) {
                  throw fastify.httpErrors.badRequest('User does not exsist');
                }

                const updatedProfile = await fastify.db.profiles.change(profile.id, {
                  ...profile,
                });

                return updatedProfile;
              }
            },
            updateMemberType: {
              type: MemberType,
              args: {
                memberType: { type: new GraphQLNonNull(UpdateMemberType) }
              },
              async resolve(_, { memberType }) {
                const memberTypeToUpdate = await fastify.db.memberTypes.findOne({ key: 'id', equals: memberType.id });

                if (memberTypeToUpdate === null) {
                  throw fastify.httpErrors.badRequest('Member type does not exsist');
                }

                const updatedMemberType = await fastify.db.memberTypes.change(memberType.id, {
                  ...memberType,
                });

                return updatedMemberType;
              }
            },
            subscribeTo: {
              type: User,
              args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                subscribeToId: { type: new GraphQLNonNull(GraphQLID) },
              },
              async resolve(_, { id, subscribeToId }) {
                const user = await fastify.db.users.findOne({ key: 'id', equals: id });

                if (user === null) {
                  throw fastify.httpErrors.notFound('User does not exsist');
                }

                const updatedUser = await fastify.db.users.change(
                  id,
                  {
                    subscribedToUserIds: [
                      ...user.subscribedToUserIds,
                      subscribeToId,
                    ],
                  }
                );

                return updatedUser;
              }
            },
            unsubscribeFrom: {
              type: User,
              args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                unsubscribeFromId: { type: new GraphQLNonNull(GraphQLID) },
              },
              async resolve(_, { id, unsubscribeFromId }) {
                const user = await fastify.db.users.findOne({ key: 'id', equals: id });

                if (user === null) {
                  throw fastify.httpErrors.notFound('User does not exsist');
                }

                const updatedSubscriptions = user.subscribedToUserIds.filter((id) => id !== unsubscribeFromId);

                if (updatedSubscriptions.length === user.subscribedToUserIds.length) {
                  throw fastify.httpErrors.badRequest('User is not subscribed');
                }

                const updatedUser = await fastify.db.users.change(
                  id,
                  {
                    subscribedToUserIds: updatedSubscriptions,
                  }
                );

                return updatedUser;
              }
            }
          }
        })
      });

      const result = await graphql({
        schema,
        source: request.body.query as any,
        variableValues: request.body.variables,
        contextValue: fastify,
      });

      return result;
    }
  );
};

export default plugin;
