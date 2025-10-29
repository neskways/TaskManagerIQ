import s from "./DocumentLink.module.scss";

export const DocumentLink = ({ name, url }) => {
  return (
    <div className={s.document_wrapper}>
      <img className={s.img} src="/images/icons/pdf.png" alt="PDF" />
      <a href={url} target="_blank" rel="noopener noreferrer" className={s.link}>
        {name}
      </a>
    </div>
  );
};


