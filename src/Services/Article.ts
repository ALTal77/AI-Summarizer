import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const RapidApiKey = import.meta.env.VITE_RAPID_API_ARTICLE_KEY;

export const articleApi = createApi({
  reducerPath: "articleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://article-extractor-and-summarizer.p.rapidapi.com/",
    prepareHeaders: (headers) => {
      headers.set("x-rapidapi-key", RapidApiKey);
      headers.set(
        "x-rapidapi-host",
        "article-extractor-and-summarizer.p.rapidapi.com"
      );
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSummary: builder.query({
      query: (params) => ({
        url: "summarize",
        params: {
          url: params.articleUrl,
          lang: "en",
          engine: "2",
        },
      }),
    }),
  }),
});

export const { useLazyGetSummaryQuery } = articleApi;
