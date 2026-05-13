"use client";

import { useState, useEffect } from "react";
import { LegalSection } from "@/lib/legal-content";
import clsx from "clsx";

export default function LegalClient({
  sections,
}: {
  sections: LegalSection[];
}) {
  const [activeId, setActiveId] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll("h1, h2");
      let currentId = "";

      // Find the first heading that is in the viewport or close to top
      for (const heading of Array.from(headings)) {
        const rect = heading.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < 300) {
          currentId = heading.id;
          break;
        }
        // If we scrolled past it, it might be the active one
        if (rect.top < 0) {
          currentId = heading.id;
        }
      }

      // Also check section containers if needed, but headings should have IDs from markdown-it-anchor
      // The H1s might not have IDs from markdown-it-anchor if we didn't configure it for H1,
      // but we can add IDs to the section wrappers.

      if (currentId) {
        setActiveId(currentId);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky header if any
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
      setIsMobileMenuOpen(false);
    }
  };

  // Flatten items for the mobile select/dropdown
  const allItems = sections.flatMap((section) => [
    { id: section.id, title: section.title, level: 1 },
    ...section.subsections.map((sub) => ({ ...sub, level: 2 })),
  ]);

  const activeItem =
    allItems.find((item) => item.id === activeId) || allItems[0];

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative max-w-7xl mx-auto px-4 py-8">
      {/* Mobile Menu (Sticky Top) */}
      <div className="lg:hidden sticky top-4 z-50 w-full bg-white shadow-lg rounded-lg border border-gray-200">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full px-4 py-3 text-left flex justify-between items-center font-medium text-gray-900"
        >
          <span className="truncate">{activeItem?.title || "Menu"}</span>
          <svg
            className={clsx(
              "w-5 h-5 transition-transform",
              isMobileMenuOpen ? "rotate-180" : ""
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isMobileMenuOpen && (
          <div className="max-h-[60vh] overflow-y-auto border-t border-gray-100">
            {sections.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => scrollToId(section.id)}
                  className={clsx(
                    "w-full text-left px-4 py-2 text-sm font-bold bg-gray-50 hover:bg-gray-100",
                    activeId === section.id && "text-blue-600"
                  )}
                >
                  {section.title}
                </button>
                {section.subsections.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => scrollToId(sub.id)}
                    className={clsx(
                      "w-full text-left px-4 py-2 pl-8 text-sm hover:bg-gray-50",
                      activeId === sub.id
                        ? "text-blue-600 font-medium"
                        : "text-gray-600"
                    )}
                  >
                    {sub.title}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Sidebar (Sticky Left) */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="space-y-6">
            {sections.map((section) => (
              <div key={section.id} className="space-y-2">
                <button
                  onClick={() => scrollToId(section.id)}
                  className={clsx(
                    "block text-base font-bold hover:text-blue-600 transition-colors text-left w-full",
                    activeId === section.id ? "text-blue-600" : "text-gray-900"
                  )}
                >
                  {section.title}
                </button>
                {section.subsections.length > 0 && (
                  <ul className="space-y-1 border-l-2 border-gray-100 ml-1">
                    {section.subsections.map((sub) => (
                      <li key={sub.id}>
                        <button
                          onClick={() => scrollToId(sub.id)}
                          className={clsx(
                            "block text-sm py-1 pl-4 hover:text-blue-600 transition-colors text-left w-full border-l-2 -ml-[2px]",
                            activeId === sub.id
                              ? "text-blue-600 border-blue-600 font-medium"
                              : "text-gray-500 border-transparent"
                          )}
                        >
                          {sub.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="space-y-16">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              {/* We don't render the title here because it's likely in the HTML content as H1. 
                  However, we need to make sure the H1 in the content has the ID we expect if we want to link to it.
                  Or we can wrap it.
                  The markdown content likely starts with H1.
                  If we put id={section.id} on the section, scrolling to it works.
              */}
              <div
                className="prose prose-lg max-w-none prose-headings:scroll-mt-24 prose-a:text-blue-600 hover:prose-a:text-blue-800"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
