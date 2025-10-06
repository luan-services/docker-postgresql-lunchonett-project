import { error } from 'console';
import { z } from 'zod';

// schema para api/auth/register
export const userRegisterSchema = z.object({
    name: z.string().nonempty({ error: 'Name is required' }).min(3, { error: 'Name must be at least 3 characters' }),
    email: z.email().nonempty( { error: 'Email is required' }),
    password: z.string().nonempty({ error: 'Password is required' }).min(8, {error: 'Password must be at least 8 characters'}).max(60, {error: 'Password must be at max 60 characters'}),
    role: z.literal('User').default('User'), // literal aqui faz com que role seja sempre 'User', para impedir requests para register selecionando role (poderia simplesmente não adicionar esse campo aqui, caso o usuário envie, o zod ia ignorar e não ia passar pro request)
    phone: z.string().optional().refine((val) => !val || /^[0-9]{10,15}$/.test(val), { message: 'Phone must contain only digits (10–15 numbers)' }),
    address: z.string().max(255, { message: 'Address must be at most 120 characters' }).optional(),

});

// criamos um type e exportamos a partir do schema do zod para não precisarmos criar uma interface e repetir código
export type UserRegisterInput = z.infer<typeof userRegisterSchema>;

// schema para api/auth/login
export const userLoginSchema = z.object({
    email: z.email().nonempty( { error: 'Email is required' }),
    password: z.string().nonempty({ error: 'Password is required' }).min(8, {error: 'Password must be at least 8 characters'}).max(60, {error: 'Password must be at max 60 characters'}),
});

// fazemos o mesmo para login
export type UserLoginInput = z.infer<typeof userRegisterSchema>;