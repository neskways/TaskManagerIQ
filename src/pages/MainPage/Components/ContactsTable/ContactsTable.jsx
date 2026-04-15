import s from "./ContactsTable.module.scss";
import { employeesData } from "./employeesData";

export const ContactsTable = () => {
  return (
    <div className={s.table}>
      <div className={`${s.row} ${s.header}`}>
        <div className={s.cell}>Внутренний номер</div>
        <div className={s.cell}>Сотрудник</div>
      </div>

      {employeesData.map(({ internalNumber, employee }) => (
        <div className={s.row} key={internalNumber}>
          <div className={s.cell}>{internalNumber}</div>
          <div className={s.cell}>{employee}</div>
        </div>
      ))}
    </div>
  );
};