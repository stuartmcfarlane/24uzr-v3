import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { ShipSchema } from "../../../prisma/generated/zod";

const userCore = {
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  name: z.string(),
  isAdmin: z.boolean().optional().default(false),
};

const createUserSchema = z.object({
  ...userCore,
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  }),
});

const updateUserSchema = z.object({
  ...userCore,
})

const createUserResponseSchema = z.object({
  id: z.number(),
  ...userCore,
});

const updateUserResponseSchema = createUserResponseSchema;

const getUserResponseSchema = z.object({
  id: z.number(),
  ...userCore,
});

const getUserShipsResponseSchema = z.array(ShipSchema);

export const UserIdParamSchema = z.object({
    id: z.coerce.number(),
}).strict()


const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  password: z
    .string({
      required_error: "Passowrd is required",
      invalid_type_error: "Passowrd must be a string",
    }),
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UserIdParamInput = z.infer<typeof UserIdParamSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
  createUserResponseSchema,
  getUserResponseSchema,
  getUserShipsResponseSchema,
  loginSchema,
  loginResponseSchema,
  updateUserSchema,
  updateUserResponseSchema,
}, {
    $id: 'userSchemas'
});