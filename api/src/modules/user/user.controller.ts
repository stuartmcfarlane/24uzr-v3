import { FastifyReply, FastifyRequest } from "fastify";
import { verifyPassword } from "../../utils/hash";
import { CreateUserInput, LoginInput, UpdateUserInput, UserIdParamInput, UserIdParamSchema } from "./user.schema";
import { createUser, findUserByEmail, findUsers, findUser, updateUser } from "./user.service";
import { findShipsByOwnerId } from "../ship/ship.service";

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;
  
  try {
    const user = await createUser(body);
    
    return reply.code(201).send(user);
  } catch (e) {
    return reply.code(500).send(e);
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;
  
  // find a user by email
  const user = await findUserByEmail(body.email);
  
  if (!user) {
    return reply.code(401).send({
      message: "Invalid email or password",
    });
  }
  
  // verify password
  const correctPassword = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password,
  });
  
  if (correctPassword) {
    const { password, salt, ...rest } = user;
    
    const token = request.jwt.sign(rest)
    
    reply.setCookie('access_token', token, {
      path: '/',
      httpOnly: true,
    })
    
    return { accessToken: token };
  }
  
  return reply.code(401).send({
    message: "Invalid email or password",
  });
}

export async function getUsersHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (!request?.user?.isAdmin) {
    return reply.code(403).send({ error: 'Forbidden' })
  }
  const users = await findUsers();
  
  return users;
}

export async function getCurrentUserHandler(
    request: FastifyRequest
) {
  const id  = request.user.id

  const user = await findUser(id)
  
  return user;
}

export async function getUserHandler(
    request: FastifyRequest<{
        Params: UserIdParamInput
    }>,
    reply: FastifyReply
) {
  const { id } = UserIdParamSchema.parse(request.params)

  if (!request.user?.isAdmin && id !== request.user?.id) {
    return reply.status(403).send({error: "Forbidden"})
  }
  const user = await findUser(id)
  
  return user;
}

export async function putCurrentUserHandler(
  request: FastifyRequest<{
    Body: UpdateUserInput;
  }>,
) {
  const { id } = request.user
  
  const user = await updateUser(id, request.body)
  
  return user;
}

export async function putUserHandler(
  request: FastifyRequest<{
    Params: UserIdParamInput
    Body: UpdateUserInput
  }>,
  reply: FastifyReply
) {
  const { id } = UserIdParamSchema.parse(request.params)

  if (!request.user?.isAdmin && id !== request.user?.id) {
    return reply.status(403).send({error: "Forbidden"})
  }
  
  const user = await updateUser(id, request.body)

  return user;
}

export async function getUserShipsHandler(
  request: FastifyRequest<{
    Params: UserIdParamInput
  }>,
) {
  const { id } = UserIdParamSchema.parse(request.params) || request.user 

  const ships = await findShipsByOwnerId(id)
  
  return ships;
}

