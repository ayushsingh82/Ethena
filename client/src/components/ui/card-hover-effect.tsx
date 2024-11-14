import { useState } from 'react';
import { cn } from "../../lib/utils"; // Assuming `cn` is a utility function to join classNames
import { AnimatePresence, motion } from "framer-motion";
import { Link } from 'react-router-dom'; // Using react-router-dom for routing

// HoverEffect Component
export const HoverEffect = ({ items, className }) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10", className)}>
      {items.map((item, idx) => (
        <Link
          to={item?.link}  // Use `to` for react-router-dom routing
          key={item?.link}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                key={idx} // Add key for proper handling of animations
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </Link>
      ))}
    </div>
  );
};

// Card Component
export const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-transparent border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

// CardTitle Component
export const CardTitle = ({ className, children }) => {
  return (
    <h4 className={cn("text-white font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};

// CardDescription Component
export const CardDescription = ({ className, children }) => {
  return (
    <p className={cn("mt-8 text-white tracking-wide leading-relaxed text-sm", className)}>
      {children}
    </p>
  );
};

// Example Page Using HoverEffect Component
const HoverEffectPage = () => {
  const items = [
    {
      title: "Title 1",
      description: "Description of item 1 goes here.",
      link: "/link-1"
    },
    {
      title: "Title 2",
      description: "Description of item 2 goes here.",
      link: "/link-2"
    },
    {
      title: "Title 3",
      description: "Description of item 3 goes here.",
      link: "/link-3"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl text-center py-12">Hover Effect Page</h1>
      <HoverEffect items={items} />
    </div>
  );
};

export default HoverEffectPage;
