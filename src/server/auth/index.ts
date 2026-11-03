import NextAuth from "next-auth";
import { cache } from "react";

import { createAuthConfig } from "./config";

const {
  auth: uncachedAuth,
  handlers,
  signIn,
  signOut,
} = NextAuth(createAuthConfig);

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
