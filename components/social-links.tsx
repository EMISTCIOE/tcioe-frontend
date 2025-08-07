import { ExternalLink } from "lucide-react";
import type { SocialLink } from "@/types";

interface SocialLinksProps {
  socialLinks: SocialLink[];
  className?: string;
}

// Social platform icons mapping
const getSocialIcon = (platform: string) => {
  switch (platform.toUpperCase()) {
    case "FACEBOOK":
      return "📘";
    case "INSTAGRAM":
      return "📷";
    case "TWITTER":
      return "🐦";
    case "LINKEDIN":
      return "💼";
    case "YOUTUBE":
      return "📺";
    case "WEBSITE":
      return "🌐";
    default:
      return "🔗";
  }
};

const getSocialColor = (platform: string) => {
  switch (platform.toUpperCase()) {
    case "FACEBOOK":
      return "bg-blue-600 hover:bg-blue-700";
    case "INSTAGRAM":
      return "bg-pink-600 hover:bg-pink-700";
    case "TWITTER":
      return "bg-sky-500 hover:bg-sky-600";
    case "LINKEDIN":
      return "bg-blue-700 hover:bg-blue-800";
    case "YOUTUBE":
      return "bg-red-600 hover:bg-red-700";
    case "WEBSITE":
      return "bg-gray-600 hover:bg-gray-700";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};

export function SocialLinks({ socialLinks, className = "" }: SocialLinksProps) {
  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {socialLinks.map((link) => (
        <a
          key={link.uuid}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${getSocialColor(
            link.platform
          )}`}
        >
          <span className="mr-2">{getSocialIcon(link.platform)}</span>
          {link.platform.charAt(0) + link.platform.slice(1).toLowerCase()}
          <ExternalLink className="ml-2 h-3 w-3" />
        </a>
      ))}
    </div>
  );
}
