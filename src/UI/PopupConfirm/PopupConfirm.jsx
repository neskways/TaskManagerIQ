import s from "./PopupConfirm.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export const PopupConfirm = ({ isOpen, text, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className={s.overlay} onClick={onCancel} />
          <motion.div
            className={s.popup}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
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
