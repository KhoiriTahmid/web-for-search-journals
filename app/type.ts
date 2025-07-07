type ArxivLink = {
  href: string;
  title: string | null;
  rel: string;
  content_type: string | null;
};

type ArxivTag = {
  term: string;
  scheme?: string;
};

type ArxivEntryRaw = {
  arxiv_comment: string;
  arxiv_doi: string;
  arxiv_journal_ref: string;
  arxiv_primary_category: {
    term: string;
    scheme: string;
  };
  author: string;
  author_detail: { name: string };
  authors: { name: string }[];
  guidislink: boolean;
  id: string;
  link: string;
  links: ArxivLink[];
  published: string;
  published_parsed: number[]; // [YYYY, MM, DD, HH, mm, SS, weekday, yearday, DST flag]
  summary: string;
  summary_detail: {
    type: string;
    language: string | null;
    base: string;
    value: string;
  };
  tags: ArxivTag[];
  title: string;
  title_detail: {
    type: string;
    language: string | null;
    base: string;
    value: string;
  };
  updated: string;
  updated_parsed: number[];
};

export type ArxivEntry = {
  authors: { name: string }[];
  categories: string[];
  comment: string;
  doi: string;
  entry_id: string;
  journal_ref: string;
  links: ArxivLink[];
  pdf_url: string;
  primary_category: string;
  published: string;
  summary: string;
  title: string;
  updated: string;
  _raw?: ArxivEntryRaw;
};
