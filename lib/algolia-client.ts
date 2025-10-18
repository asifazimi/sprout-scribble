import algoliasearch, { SearchClient } from "algoliasearch";

export const searchClient: SearchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH!
);
