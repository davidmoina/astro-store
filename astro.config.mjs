// @ts-check
import { defineConfig } from "astro/config";

import netlify from "@astrojs/netlify";
import tailwindcss from "@tailwindcss/vite";

import auth from "auth-astro";

import db from "@astrojs/db";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  output: "server",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [auth(), db(), react()],
});
