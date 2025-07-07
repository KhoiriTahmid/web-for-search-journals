"use client";
import { useState, useEffect } from "react";
import { ArxivEntry } from "./type";
import { categoryMap } from "./category";
import Link from "next/link";

type SearchResult = [ArxivEntry, unknown];

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<number>(0);
  const [data, setData] = useState<ArxivEntry[] | []>([]);

  async function search() {
    setLoading(true);
    fetch("api/search?query=" + query.replace(" ", "%20"))
      .then((res) => res.json())
      .then((res) => {
        const result = res!.results.map((e: SearchResult) => e[0]);
        setData(result);
        localStorage.setItem("search_results", JSON.stringify(result));
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const stored = localStorage.getItem("search_results");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (err) {
        console.error("Error parsing localStorage:", err);
      }
    }
  }, []);
  return (
    <div className="min-h-screen flex">
      <div className="left flex flex-col relative gap-2 py-10 px-5 min-h-screen w-[28%] border-gray-600 border-r">
        {loading ? (
          <SkeletonSide />
        ) : data.length === 0 ? (
          <p className="text-center text-gray-500 mt-40">No results yet.</p>
        ) : (
          <>
            <div className="flex gap-8 text-sm">
              <p className="text-gray-500">
                {data[active]?.published.slice(0, 10)}
              </p>
              {data[active]?.categories.map((e, i) => (
                <p key={i} className="text-gray-500">
                  {categoryMap[e]}
                </p>
              ))}
            </div>
            <h1 className="text-gray-200 font-medium text-wrap text-lg">
              {data[active]?.title}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {data[active]?.authors.map((e) => e.name).join(", ")}
            </p>
            <p className="text-sm text-gray-500 mt-8">summary:</p>
            <p className="text-sm text-gray-500 text-justify overflow-y-auto max-h-96 thin-scrollbar pr-2">
              {data[active]?.summary}
            </p>
            <div className="flex w-[calc(100%_-_var(--spacing)*10)]  justify-center gap-4 absolute bottom-8">
              <Link
                href={data[active]?.pdf_url?.replace("pdf", "abs")}
                className="button w-full text-center px-5 py-2 rounded-md bg-gray-100 text-gray-900 font-medium cursor-pointer hover:opacity-85"
              >
                Source
              </Link>
              <Link
                href={data[active]?.pdf_url}
                className="button w-full text-center px-5 py-2 rounded-md text-gray-100 border border-gray-800 font-medium cursor-pointer hover:text-white hover:border-gray-100/50"
              >
                PDF
              </Link>
            </div>
          </>
        )}
      </div>
      <div className="right relative  min-h-screen w-[72%] ">
        <div className="flex justify-left absolute pl-5 pr-9 py-5 items-center gap-5 backdrop-blur-md w-full ">
          <input
            type="text"
            placeholder="search something..."
            onKeyDown={(e) => e.key === "Enter" && search()}
            onChange={(e) => setQuery(e.currentTarget.value)}
            className="search rounded-md w-full border text-gray-100 border-gray-800 outline-none px-3 py-1 focus:border-gray-300/50 focus:ring-2 focus:ring-gray-400/40  focus:shadow-lg focus:shadow-gray-400/40"
          />
          <div
            onClick={search}
            className="button px-5 py-1 rounded-md bg-gray-100 text-gray-900 font-medium cursor-pointer hover:opacity-85"
          >
            Search
          </div>
        </div>
        <div className="h-svh flex flex-col gap-2 overflow-y-scroll thin-scrollbar mr-2">
          {loading ? (
            [1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
              <SkeletonCard key={i} index={i + 1} />
            ))
          ) : data.length === 0 ? (
            <p className="text-center text-gray-500 mt-40">No results yet.</p>
          ) : (
            data.map((e, i) => (
              <Card
                key={i}
                data={e}
                index={i + 1}
                active={active}
                length={data.length}
                setActive={setActive}
              />
            ))
          )}
        </div>
        <div className="absolute bottom-0 w-full h-14 bg-gradient-to-t from-[rgba(24,24,27,1)] to-transparent backdrop-blur-md"></div>
      </div>
    </div>
  );
}
function SkeletonSide() {
  return (
    <div className="animate-pulse space-y-4 mt-20">
      <div className="flex gap-8 text-sm">
        <div className="bg-gray-700 h-4 w-24 rounded"></div>
        <div className="bg-gray-700 h-4 w-20 rounded"></div>
      </div>
      <div className="h-6 bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      <div className="h-4 bg-gray-700 rounded w-1/4 mt-8"></div>
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-3 bg-gray-700 rounded w-full" />
        ))}
      </div>
      <div className="flex gap-4 absolute bottom-8 w-[calc(100%_-_var(--spacing)*10)]">
        <div className="h-9 bg-gray-700 rounded w-full"></div>
        <div className="h-9 bg-gray-700 rounded w-full"></div>
      </div>
    </div>
  );
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      className={`card animate-pulse mx-5 h-fit rounded-xl py-3 px-3 border border-gray-800 flex gap-3 items-center ${
        index == 1 && "mt-20"
      } `}
    >
      <div className="w-5 h-5 bg-gray-800 rounded-full" />
      <div className="h-10 border border-gray-800"></div>
      <div className="flex flex-col gap-2 w-full">
        <div className="h-4 bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );
}

function Card({
  data,
  index,
  active,
  length,
  setActive,
}: {
  data: ArxivEntry;
  index: number;
  active: number;
  length: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div
      onClick={() => setActive(index - 1)}
      className={`card group  mx-5 h-fit rounded-xl py-3 px-3 border flex gap-3 items-center   cursor-pointer hover:border-gray-100/50 
        ${active + 1 == index ? "bg-gray-100 " : "border-gray-800"} ${
        index == 1 && "mt-20"
      } ${index == length && "mb-20"}`}
    >
      <p className={`${active + 1 == index && "text-gray-900"} text-center`}>
        {index}
      </p>
      <div className="h-10 border border-gray-800"></div>
      <div className="">
        <h1
          className={`text-gray-200 font-medium text-wrap text-lg ${
            active + 1 == index && "text-gray-900"
          }`}
        >
          {data.title}
        </h1>
        <div className="flex gap-8 text-sm">
          <p className="text-gray-500">{data.published.slice(0, 10)}</p>
          {data.categories.map((e, i) => (
            <p key={i} className="text-gray-500">
              {categoryMap[e]}
            </p>
          ))}
          <p className="text-sm text-gray-500 mt-1">
            {data.authors.map((e) => e.name).join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}
