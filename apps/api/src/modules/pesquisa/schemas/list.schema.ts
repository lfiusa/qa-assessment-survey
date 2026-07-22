import z from "zod";

export const listDefaultQuerySchema = z.object({
  empresaId: z.string(),
  page: z.coerce
    .string()
    .optional()
    .transform((value) => value && Number(value))
    .pipe(z.coerce.number().min(1).default(1)),
  perPage: z.coerce
    .string()
    .optional()
    .transform((value) => value && Number(value))
    .pipe(z.coerce.number().min(1).max(30).default(10)),
  ordination: z.enum(["asc", "desc"]).default("desc"),
});
