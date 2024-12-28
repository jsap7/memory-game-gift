import FlipTimer from './FlipTimer';
import BackButton from './BackButton';

const GameLayout = ({ children, title }) => {
  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="nav-container fade-in">
          <BackButton />
        </div>
        
        <div className="fade-in">
          <FlipTimer />
        </div>
        
        <h1 className="page-title slide-up">{title}</h1>
        
        <div className="fade-in">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GameLayout; 