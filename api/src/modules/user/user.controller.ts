import { FastifyReply, FastifyRequest } from "fastify";
import { verifyPassword } from "../../utils/hash";
import { CreateUserInput, LoginInput } from "./user.schema";
import { createUser, findUserByEmail, findUsers } from "./user.service";

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
      secure: true,
    })
    
    return { accessToken: token };
  }
  
  return reply.code(401).send({
    message: "Invalid email or password",
  });
}

export async function getUsersHandler() {
  const users = await findUsers();
  
  return users;
}

export async function getUserHandler(
  request: FastifyRequest,
) {
  const user = request.user
  
  return user;
}