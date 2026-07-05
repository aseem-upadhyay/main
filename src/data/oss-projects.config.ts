export interface OssProjectConfig {
  num: string;
  category: string;
  title: string;
  subtitle: string;
  npm_package: string;
  npm_link: string;
  github_repo: string;
  github_link: string;
}

export const OSS_PROJECT_CONFIG: OssProjectConfig[] = [
  {
    num: "01",
    category: "Open Source · npm Package",
    title: "React Timer",
    subtitle: "A minimalistic yet customizable timer component for React.",
    npm_package: "@xendora/react-timer",
    npm_link: "https://www.npmjs.com/package/@xendora/react-timer",
    github_repo: "xendora/react-timer",
    github_link: "https://github.com/xendora/react-timer",
  },
];
