import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation, useScroll } from "framer-motion";

const TopBarBmController = ({
  children,
  width = "fit-content",
  open,
  widthGrowth,
}) => {
  const [h, setH] = useState(widthGrowth);
  const maincontrols = useAnimation();
  useEffect(() => {
    if (open) {
      maincontrols.start("visible");
    } else {
      maincontrols.start("hidden");
    }
  }, [open, widthGrowth]);

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        width: "full",
        height: "100%",
      }}
    >
      <motion.div
        variants={{
          hidden: { width: 0 },
          visible: { width: "100%" },
        }}
        initial="hidden"
        animate={maincontrols}
        transition={{ duration: 0.5, delay: 0 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default TopBarBmController;
