import { Button } from "../../../../UI/Button/Button";
import s from "./ReportForm.module.scss";

export const ReportForm = () => {
  return (
    <div className={s.block}>
        <div className={s.btn_wrap}>
            <Button name={"Сформировать отчет"} smallSise={true} />
        </div>
    </div>
  );
};
