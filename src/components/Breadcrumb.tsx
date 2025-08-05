import { Link, useLocation } from "react-router-dom";
import { FiChevronRight, FiHome } from "react-icons/fi";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const location = useLocation();

  // Generate breadcrumbs from current path if items not provided
  const generatedItems: BreadcrumbItem[] =
    items ||
    (() => {
      const pathSegments = location.pathname.split("/").filter(Boolean);
      const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

      let currentPath = "";
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const isLast = index === pathSegments.length - 1;

        // Format segment for display
        let label = segment.charAt(0).toUpperCase() + segment.slice(1);
        if (segment === "blog") label = "Engineering Leadership Blog";
        if (segment === "about") label = "About";
        if (segment === "projects") label = "Projects";

        breadcrumbs.push({
          label,
          href: isLast ? undefined : currentPath,
          current: isLast,
        });
      });

      return breadcrumbs;
    })();

  if (generatedItems.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        {generatedItems.map((item, index) => (
          <li key={item.href || item.label} className="flex items-center">
            {index > 0 && <FiChevronRight className="w-4 h-4 mx-2" />}

            {index === 0 && <FiHome className="w-4 h-4 mr-1" />}

            {item.href ? (
              <Link
                to={item.href}
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-gray-900 dark:text-gray-100 font-medium"
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>

      {/* Structured data for breadcrumbs */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: generatedItems.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            ...(item.href && { item: `https://jiazhenxie.com${item.href}` }),
          })),
        })}
      </script>
    </nav>
  );
}
