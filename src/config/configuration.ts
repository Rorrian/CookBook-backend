import { z } from 'zod';

//TODO: удалить библиотеку ms ?

//TODO: где в других местах можно использовать zod ?

// Определяем схему для переменных окружения
const envSchema = z.object({
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().min(1, 'JWT_ACCESS_TOKEN_EXPIRES_IN is required'),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string().min(1, 'JWT_REFRESH_TOKEN_EXPIRES_IN is required'),
});

// Тип, основанный на схеме zod
export type AppConfig = z.infer<typeof envSchema>;

// Валидация переменных окружения
export const loadConfig = (): AppConfig => {
  const config = {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  };

  try {
    return envSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Configuration validation error: ${error.message}`);
    }
    throw new Error('Unknown configuration error');
  }
};