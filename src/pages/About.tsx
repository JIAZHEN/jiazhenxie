import { motion } from "framer-motion";
import { FiCode, FiDatabase, FiCpu } from "react-icons/fi";

const skills = [
  {
    category: "Frontend",
    icon: <FiCode />,
    items: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
  },
  {
    category: "Backend",
    icon: <FiDatabase />,
    items: ["Node.js", "Express", "PostgreSQL", "MongoDB"],
  },
  {
    category: "DevOps",
    icon: <FiCpu />,
    items: ["Docker", "AWS", "CI/CD", "GitHub Actions"],
  },
];

const About = () => {
  return (
    <div className="max-w-4xl mx-auto py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <h1 className="text-4xl font-bold mb-6">About Me</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-4">
            I’m an engineering leader with over 14 years of experience building
            and scaling high-performing teams. I’ve led complex,
            cross-functional projects to success and improved delivery
            efficiency by up to 50%. My leadership style is grounded in clarity,
            empathy, and data—I strive to foster a culture of ownership,
            continuous improvement, and high trust.
          </p>
          <p className="text-lg">
            I bring a strong technical foundation—enough to operate at a
            Principal Engineer level—paired with the strategic mindset needed
            for senior leadership. I’m fluent in both Western and Chinese
            business and engineering cultures, which helps me lead inclusively,
            navigate global collaboration, and bring diverse perspectives to the
            table. I care deeply about creating impact, building trust, and
            inspiring the people I work with.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold mb-8">Skills & Technologies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg"
            >
              <div className="flex items-center mb-4">
                <div className="text-primary-500 mr-3 text-xl">
                  {skill.icon}
                </div>
                <h3 className="text-xl font-semibold">{skill.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default About;
