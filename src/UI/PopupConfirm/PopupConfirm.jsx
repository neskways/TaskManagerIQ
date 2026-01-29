import s from "./PopupConfirm.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export const PopupConfirm = ({ isOpen, text, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={s.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            onClick={onCancel}
          />

          <motion.div
            className={s.popup}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
          >
            <div className={s.icon}>
              <AlertTriangle size={26} />
            </div>

            <p className={s.text}>{text}</p>

            <div className={s.btns}>
              <button className={s.btnYes} onClick={onConfirm}>
                Да
              </button>
              <button className={s.btnNo} onClick={onCancel}>
                Нет
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
