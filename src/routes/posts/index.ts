import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    return await fastify.db.posts.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const post = await fastify.db.posts.findOne({ key: 'id', equals: request.params.id });

      if (post === null) {
        throw fastify.httpErrors.notFound('Post does not exsist');
      }

      return post;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const newPost = await fastify.db.posts.create(request.body);

      if (!newPost) {
        throw fastify.httpErrors.badRequest('Post is not created');
      }

      return newPost;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const post = await fastify.db.posts.findOne({ key: 'id', equals: request.params.id });

      if (post === null) {
        throw fastify.httpErrors.badRequest('Post was not found');
      }

      const postToDelete = await fastify.db.posts.delete(request.params.id);

      return postToDelete;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> { 
      const post = await fastify.db.posts.findOne({ key: 'id', equals: request.params.id });

      if (post === null) {
        throw fastify.httpErrors.badRequest('Post does not exsist');
      }

      const updatedPost = await fastify.db.posts.change(request.params.id, {
        ...request.body,
      });

      return updatedPost;
    }
  );
};

export default plugin;
