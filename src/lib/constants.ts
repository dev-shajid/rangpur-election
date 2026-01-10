
export const DISTRICTS = [
  "rangpur",
  "dinajpur",
  "kurigram",
  "lalmonirhat",
  "nilphamari",
  "panchagarh",
  "thakurgaon",
  "gaibandha",
] as const;

export type DistrictName = typeof DISTRICTS[number];

export const APP_NAME = "Rangpur Division Election Info";
export const APP_DESCRIPTION = "Official election information portal for Rangpur Division, Bangladesh.";

export const DISTRICT_COLORS: Record<string, { bg: string; hoverBg: string; text: string, badge: string }> = {
    "rangpur": {
      bg: "bg-blue-500",
      hoverBg: "hover:bg-blue-600 hover:dark:bg-blue-400",
      text: "text-blue-700 dark:text-blue-300",
      badge: "bg-blue-500/10 text-blue-500 hover:bg-blue-600 hover:dark:bg-blue-400"
    },
    "dinajpur": {
      bg: "bg-green-500",
      hoverBg: "hover:bg-green-600 hover:dark:bg-green-400",
      text: "text-green-700 dark:text-green-300",
      badge: "bg-green-500/10 text-green-500 hover:bg-green-600 hover:dark:bg-green-400"
    },
    "kurigram": {
      bg: "bg-yellow-500",
      hoverBg: "hover:bg-yellow-600 hover:dark:bg-yellow-400",
      text: "text-yellow-700 dark:text-yellow-300",
      badge: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-600 hover:dark:bg-yellow-400"
    },
    "lalmonirhat": {
      bg: "bg-red-500",
      hoverBg: "hover:bg-red-600 hover:dark:bg-red-400",
      text: "text-red-700 dark:text-red-300",
      badge: "bg-red-500/10 text-red-500 hover:bg-red-600 hover:dark:bg-red-400"
    },
    "nilphamari": {
      bg: "bg-indigo-500",
      hoverBg: "hover:bg-indigo-600 hover:dark:bg-indigo-400",
      text: "text-indigo-700 dark:text-indigo-300",
      badge: "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-600 hover:dark:bg-indigo-400"
    },
    "panchagarh": {
      bg: "bg-orange-500",
      hoverBg: "hover:bg-orange-600 hover:dark:bg-orange-400",
      text: "text-orange-700 dark:text-orange-300", 
      badge: "bg-orange-500/10 text-orange-500 hover:bg-orange-600 hover:dark:bg-orange-400"
    },
    "thakurgaon": {
      bg: "bg-purple-500",
      hoverBg: "hover:bg-purple-600 hover:dark:bg-purple-400",
      text: "text-purple-700 dark:text-purple-300",
      badge: "bg-purple-500/10 text-purple-500 hover:bg-purple-600 hover:dark:bg-purple-400"
    },
    "gaibandha": {
      bg: "bg-cyan-500",
      hoverBg: "hover:bg-cyan-600 hover:dark:bg-cyan-400",
      text: "text-cyan-700 dark:text-cyan-300",
      badge: "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-600 hover:dark:bg-cyan-400"
    },
};