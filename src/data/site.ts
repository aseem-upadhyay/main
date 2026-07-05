import { OSS_PROJECT_CONFIG } from "./oss-projects.config";
import ossStats from "./oss-stats.generated.json";
import experienceData from "./experience.json";

export const SITE_URL = "https://aseemupadhyay.com";
export const SITE_NAME = "Aseem Upadhyay";
export const SITE_TITLE = "Aseem Upadhyay — Engineering Manager";
export const SITE_DESCRIPTION =
  "An AI first mindset engineer who dwells in the space between ambiguity and execution.";

export const NAV_ITEMS = [
  { id: "about", label: "About", href: "/" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "contact", label: "Contact", href: "/contact" },
] as const;

export const EXPERIENCE = experienceData;

export const SKILLS = [
  {
    category: "Engineering leadership",
    description:
      "Hiring, mentoring people, and clearing the bottlenecks that slow teams down across different stacks.",
  },
  {
    category: "Product delivery",
    description:
      "Planning the roadmap and getting the right people and resources lined up so ideas actually turn into shipped work.",
  },
  {
    category: "Frontend architecture",
    description:
      "Built and scaled products from the ground up, mostly living in React and its ecosystem.",
  },
  {
    category: "Backend and data flow",
    description:
      "Comfortable with Node.js, GraphQL, APIs, queues, and SQL, the plumbing that lets decisions be backed by real data.",
  },
  {
    category: "Infrastructure and cloud",
    description:
      "AWS, Docker, CI/CD, GitHub Actions, and increasingly AI assisted workflows baked into how I ship.",
  },
  {
    category: "Quality systems",
    description:
      "Core Web Vitals, observability, testing, and the feedback loops that keep all of it honest.",
  },
];

export const OSS_PROJECTS = OSS_PROJECT_CONFIG.map((project) => {
  const stats = (ossStats as Record<string, { weekly_downloads: string; downloads_till_date: string; github_stars: string }>)[
    project.npm_package
  ];
  return {
    ...project,
    weekly_downloads: stats?.weekly_downloads ?? "—",
    downloads_till_date: stats?.downloads_till_date ?? "—",
    github_stars: stats?.github_stars ?? "—",
  };
});

export const POSTS = [
  {
    title: "How We Built an AI Agent to Clean Up Dead Code After A/B Tests",
    subtitle:
      "At Housing.com, running product experiments is a continuous cycle. A/B tests go live, collect data, and eventually reach a conclusion…",
    published_date: "Jun 23, 2026",
    article_length: "4 min read",
    url: "https://medium.com/engineering-housing/how-we-built-an-ai-agent-to-clean-up-dead-code-after-a-b-tests-a5519af4892e",
  },
  {
    title: "The CLS Cheatsheet (Vol. 4)",
    subtitle: "After years of trial, we found no one solution that fits all.",
    published_date: "May 9, 2024",
    article_length: "5 min read",
    url: "https://medium.com/engineering-housing/the-cls-cheatsheet-vol-4-3bc22d7e6f1e",
  },
  {
    title: "CLS: Changing the Perspective (Vol.3)",
    subtitle: "Thinking beyond banners and placeholders..",
    published_date: "Dec 15, 2022",
    article_length: "4 min read",
    url: "https://medium.com/engineering-housing/cls-changing-the-perspective-vol-3-1d19f0fb5502",
  },
  {
    title: "CLS: Treading into the Unknown (Vol. 2)",
    subtitle: "It's time we debug issues present in the second fold",
    published_date: "Feb 11, 2022",
    article_length: "7 min read",
    url: "https://medium.com/engineering-housing/cls-treading-into-the-unknown-vol-2-33ef3229498",
  },
  {
    title: "Solving Cumulative Layout Shifts At Scale",
    subtitle:
      "A documented journey of all the enhancements that have been made on Housing.com to improve the CLS scores of a webpage",
    published_date: "Sep 16, 2021",
    article_length: "5 min read",
    url: "https://medium.com/engineering-housing/solving-cumulative-layout-shifts-at-scale-e91f0d3b3be4",
  },
  {
    title: "The Story of a Timer",
    subtitle: "Journey of an OSS project",
    published_date: "Dec 1, 2019",
    article_length: "2 min read",
    url: "https://medium.com/@aseemupadhyay/the-story-of-a-timer-60210263364c",
  },
  {
    title: "Dynamic Serving with Electrode",
    subtitle:
      "Dynamic serving is a setup where the server responds with different HTML (and CSS) on the same URL depending on the user agent…",
    published_date: "Jul 30, 2019",
    article_length: "3 min read",
    url: "https://medium.com/@aseemupadhyay/dynamic-serving-with-electrode-51467bce45e3",
  },
];

export const SOCIALS = [
  { label: "Email", handle: "upadhyay.aseem@outlook.com", href: "mailto:upadhyay.aseem@outlook.com" },
  { label: "LinkedIn", handle: "in/aseemupadhyay", href: "https://in.linkedin.com/in/aseemupadhyay" },
  { label: "GitHub", handle: "aseem-upadhyay", href: "https://github.com/aseem-upadhyay" },
];
