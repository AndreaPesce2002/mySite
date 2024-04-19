import './styles/work_card.css';

const WorkCard = ({ title, description, image }) => {
  return (
      <div className="card_work_card">
        <div className="image_work_card">
          <img src={image} alt={title} />
        </div>
        <div className="content_work_card">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
  );
};

export default WorkCard;