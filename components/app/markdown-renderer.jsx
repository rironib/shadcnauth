import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * 📝 Unified Markdown Renderer
 * Uses remark-gfm for advanced syntax and custom components for optimized navigation.
 */
export function MarkdownRenderer({ content, className = "" }) {
  const markdownComponents = {
    a: ({ node, ...props }) => {
      // Check if it's an external link
      const isExternal = props.href?.startsWith("http");

      if (isExternal) {
        return (
          <a
            href={props.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
            aria-label={`${props.children} (opens in a new tab)`}
          >
            {props.children}
          </a>
        );
      }

      return (
        <Link href={props.href || "#"} className="text-primary hover:underline">
          {props.children}
        </Link>
      );
    },
    // You can add more global overrides here (e.g., pre, code, img)
  };

  return (
    <div
      className={`prose prose-neutral dark:prose-invert prose-sm max-w-none ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {content || ""}
      </ReactMarkdown>
    </div>
  );
}
