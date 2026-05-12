import { motion } from "framer-motion";

export default function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ y: 10 }}
      animate={{ y: 0 }}
      exit={{ y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      {children}
    </motion.div>
  );
}