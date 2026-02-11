import s from "./ClientModal.module.scss";
import { ModelWindow } from "../../../../components/ModelWindow/ModelWindow";

export const ClientModal = ({ clientData, onClose }) => {
  
  return (
    <ModelWindow isOpen={!!clientData} onClose={onClose}>
      <div className={s.modalContent}>
        <h2>Данные клиента</h2>

        <p><strong>Имя:</strong> {clientData?.name}</p>
        <p><strong>Статус:</strong> {clientData?.status}</p>
        <p><strong>Телефон:</strong> {clientData?.phone}</p>
      </div>
    </ModelWindow>
  );
};
