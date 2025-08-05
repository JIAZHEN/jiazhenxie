import { motion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import SEO from "../components/SEO";

// This would typically come from an API or file system
const projects = [
  {
    id: 1,
    title: "Personal Website",
    description:
      "A modern portfolio website built with React, TypeScript, and Tailwind CSS.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    githubUrl: "https://github.com/yourusername/personal-website",
    liveUrl: "https://yourwebsite.com",
    image: "/project1.jpg",
  },
  {
    id: 2,
    title: "E-commerce Platform",
    description:
      "A full-stack e-commerce platform with user authentication and payment integration.",
    technologies: ["Next.js", "Node.js", "MongoDB", "Stripe"],
    githubUrl: "https://github.com/yourusername/ecommerce",
    liveUrl: "https://ecommerce-demo.com",
    image: "/project2.jpg",
  },
];

const ProjectCard = ({ project }: { project: (typeof projects)[0] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden"
    >
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex space-x-4">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-500"
          >
            <FiGithub className="mr-1" />
            GitHub
          </a>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-500"
          >
            <FiExternalLink className="mr-1" />
            Live Demo
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  return (
    <>
      <SEO
        title="Engineering Projects & Portfolio | Jiazhen Xie - Chinese Tech Leader"
        description="Explore engineering projects and technical portfolio of Jiazhen Xie, Oxford-educated Chinese engineering leader in UK. Full-stack development, distributed systems, and engineering leadership projects."
        type="website"
        keywords={[
          "engineering projects",
          "software portfolio",
          "full-stack projects",
          "Chinese engineer UK",
          "Oxford engineering projects",
          "distributed systems",
          "software architecture",
          "engineering leadership portfolio",
          "tech projects UK",
        ]}
        canonicalUrl="https://jiazhenxie.com/projects"
      />
      <div className="max-w-4xl mx-auto py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-8">
            Engineering Projects & Portfolio
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
            Explore my engineering projects showcasing full-stack development,
            software architecture, and technical leadership. Each project
            demonstrates different aspects of modern engineering practices and
            my approach to building scalable solutions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Projects;
