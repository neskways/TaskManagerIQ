import s from "./ClientModal.module.scss";
import { ModelWindow } from "../../../../components/ModelWindow/ModelWindow";
import { useContacts } from "./useContacts";
import { Loading } from "../../../../UI/Loading/Loading";

export const ClientModal = ({ clientData, onClose }) => {
  const {
    loading,
    contactOptions,
  } = useContacts(clientData);

  console.log(contactOptions)

  return (
    <ModelWindow isOpen={!!clientData} onClose={onClose}>
      <div className={s.modalContent}>
        {loading ? (
          <div className={s.loadingWrapper}>
            <Loading />
          </div>
        ) : (
          <>
            <h2 className={s.title}>{clientData?.Name}</h2>

            <h3 className={s.subtitle}>Контакты</h3>

            {contactOptions.length > 0 ? (
              <div className={s.contactsTable}>
                <div className={`${s.row} ${s.header}`}>
                  <div>Имя</div>
                  <div>Должность</div>
                  <div>Телефон</div>
                  <div>Email</div>
                </div>

                {contactOptions.map((contact) => (
                  <div key={contact.id} className={s.row}>
                    <div>{contact.data?.name || "-"}</div>
                    <div>{contact.data?.post || "-"}</div>
                    <div>{contact.data?.phone || "-"}</div>
                    <div>{contact.data?.mail || "-"}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Контакты не найдены</p>
            )}
          </>
        )}
      </div>
    </ModelWindow>
  );
};