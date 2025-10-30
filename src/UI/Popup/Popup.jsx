import { AnimatePresence, motion } from "framer-motion";
import s from "./Popup.module.scss";

export const Popup = ({ showPopup, text, type, marginNone }) => {
  return (
    <AnimatePresence mode="wait">
      {showPopup && (
        <motion.div
          key="popup"
          className={`${s.popup} ${type ? s.true : s.false} ${marginNone ? "" : s.popupMargin}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <p>{text}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
