import { Button } from "../../../../UI/Button/Button";
import s from "./ReportForm.module.scss";

export const ReportForm = ({ selectedReport }) => {
  const handleGenerate = () => {
    console.log("Формируем отчет:", selectedReport.id);
  };

  return (
    <div className={s.block}>
      <div className={s.btn_wrap}>
        <Button
          name="Сформировать отчет"
          smallSise={true}
          onClick={handleGenerate}
        />
      </div>
    </div>
  );
};