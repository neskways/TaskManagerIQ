import s from "./PopupList.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

const icons = {
  success: <CheckCircle />,
  error: <XCircle />,
  warning: <AlertTriangle />,
  info: <Info />,
};

export const PopupList = ({ popups, removePopup }) => {
  return (
    <div className={s.stackContainer}>
      <AnimatePresence>
        {popups.map(({ id, text, type, center }) => (
          <motion.div
            key={id}
            className={`${s.popup} ${s[type]} ${!center ? s.marginTrue : ""}`}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={() => removePopup(id)}
          >
            <div className={s.icon}>{icons[type]}</div>
            <p>{text}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
