import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { MouseEvent } from "react";
import type { ChangeEvent } from "react";
import link from "../assets/link.svg";
import copy from "../assets/copy.svg";
import loader from "../assets/loader.svg";

const RapidApiKey = import.meta.env.VITE_RAPID_API_ARTICLE_KEY;
type ArticleType = {
  id: string;
  url: string;
  summary: string;
  timestamp: number;
};

function Demo() {
  const [article, setArticle] = useState<ArticleType>({
    id: "",
    url: "",
    summary: "",
    timestamp: 0,
  });
  const [allArticles, setAllArticles] = useState<ArticleType[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("articles") || "[]");
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("articles", JSON.stringify(allArticles));
  }, [allArticles]);

  const generateId = () =>
    Date.now().toString(36) + Math.random().toString(36).substring(2);

  const handelSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!article.url?.startsWith("http")) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    const existing = allArticles.find((item) => item.url === article.url);
    if (existing) {
      setArticle(existing);
      return;
    }

    setIsLoading(true);
    const apiUrl = `https://article-extractor-and-summarizer.p.rapidapi.com/summarize?url=${encodeURIComponent(
      article.url
    )}&lang=en&engine=2`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": RapidApiKey,
        "x-rapidapi-host": "article-extractor-and-summarizer.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(apiUrl, options);
      const result = await response.text();
      if (response.ok) {
        const data = JSON.parse(result);
        if (data.summary) {
          const newArticle = {
            id: generateId(),
            url: article.url,
            summary: data.summary,
            timestamp: Date.now(),
          };
          setArticle(newArticle);
          setAllArticles((prev) => [newArticle, ...prev]);
        } else setError("No summary available. Try a different URL.");
      } else {
        const errorData = JSON.parse(result);
        setError(
          errorData.error?.includes("Failed extracting text")
            ? "This page doesn't have readable text content. Try a news article, blog post, or Wikipedia page."
            : response.status === 503
            ? "Service temporarily unavailable. Please try again later."
            : `API Error: ${response.status}`
        );
        console.error("API Error:", response.status, result);
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.");
      console.error("Network Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArticle = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    const updated = allArticles.filter((item) => item.id !== id);
    setAllArticles(updated);
    if (article.id === id)
      setArticle({ id: "", url: "", summary: "", timestamp: 0 });
  };

  const copyToClipboard = (text: string, e: MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Copied!"))
      .catch((err) => console.error("Failed to copy:", err));
  };

  const exampleLinks = [
    {
      name: "Wikipedia: Artificial Intelligence",
      url: "https://en.wikipedia.org/wiki/Artificial_intelligence",
    },
    { name: "BBC News Homepage", url: "https://www.bbc.com/news" },
    { name: "Medium Articles", url: "https://medium.com" },
  ];

  return (
    <section className="mt-16 w-full max-w-xl font-mono">
      <form
        className="relative flex justify-center items-center"
        onSubmit={handelSubmit}
      >
        <img
          src={link}
          alt="Link_Icon"
          className="absolute left-0 my-2 ml-3 w-5"
        />
        <input
          type="url"
          placeholder="Enter a URL (e.g., https://en.wikipedia.org/wiki/Artificial_intelligence)"
          value={article.url}
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setArticle({ ...article, url: e.target.value })
          }
          required
          className="peer url_input bg-white dark:bg-gray-800 text-gray-900 border border-gray-300 dark:border-gray-600
             placeholder:text-xs sm:placeholder:text-xs
             placeholder:truncate "
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`submit_btn peer:focus:border-gray-700 peer-focus:text-gray-700 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "⏳" : "↵"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">
            Recent Articles ({allArticles.length})
          </h3>
          {allArticles.length > 0 && (
            <button
              onClick={() =>
                window.confirm("Clear all history?") && setAllArticles([])
              }
              className="text-sm text-red-500 hover:text-red-700 cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {allArticles.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No articles yet. Summarize your first article!
            </p>
          ) : (
            allArticles.map((item) => (
              <div
                key={item.id}
                onClick={() => setArticle(item)}
                className={`link_card group hover:bg-blue-50 relative transition-colors cursor-pointer ${
                  article.id === item.id ? "bg-blue-50 border-blue-300" : ""
                }`}
              >
                <div className="flex items-center gap-2 pr-8">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <img
                      src={copy}
                      alt="copy_icon"
                      className="w-4 h-4 opacity-50 hover:opacity-100"
                      onClick={(e: MouseEvent) => copyToClipboard(item.url, e)}
                      title="Copy URL"
                    />
                    <p className="flex-1 text-blue-700 font-medium text-sm truncate">
                      {item.url}
                    </p>
                  </div>
                  <button
                    onClick={(e: MouseEvent) => deleteArticle(item.id, e)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer p-1 rounded-full hover:bg-red-50"
                    title="Delete article"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <div className="flex flex-col items-center justify-center">
              <img
                src={loader}
                alt="Loading"
                className="w-12 h-12 animate-spin mb-3"
              />
              <h3 className="text-lg font-semibold mb-2">Processing Article</h3>
              <p className="text-gray-600">
                Please wait while we summarize the content...
              </p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-amber-600 h-2 rounded-full animate-pulse"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
          </div>
        ) : article.summary ? (
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Article Summary
              </h3>
              <button
                onClick={() =>
                  copyToClipboard(article.summary, {
                    stopPropagation: () => {},
                  } as MouseEvent)
                }
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                title="Copy summary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </button>
            </div>
            <div className="bg-white p-4 rounded border border-amber-300">
              <p className="text-gray-700 dark:text-gray-300 font-sans">
                {article.summary}
              </p>
            </div>
            <div className="mt-3 text-sm text-gray-500 text-center">
              <span>{new Date(article.timestamp).toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-white border border-gray-300 rounded-lg text-center mb-10">
            <h3 className="text-lg font-semibold mb-2">
              No Article Summarized Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Enter a URL above to get started. Try these examples:
            </p>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {exampleLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => setArticle({ ...article, url: link.url })}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded cursor-pointer"
                >
                  • {link.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Demo;
