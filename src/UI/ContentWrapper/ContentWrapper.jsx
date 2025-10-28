import styles from "./ContentWrapper.module.scss";

export const ContentWrapper = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>{children}</div>
    </div>
  );
};
