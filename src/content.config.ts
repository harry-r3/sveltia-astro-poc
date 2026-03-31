import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
    price: z.number(),
    currency: z.string().default("USD"),
    image: z.string(),
    features: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
      })
    ),
    cta_text: z.string().default("Get Started"),
    cta_url: z.string().default("#"),
    published: z.boolean().default(true),
    date: z.coerce.date(),
  }),
});

export const collections = { products };
