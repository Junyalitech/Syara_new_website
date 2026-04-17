import React, { useEffect } from "react";
import "./DirectorSection.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchDirector } from "../../features/about/directorprofile";

const DirectorSection = () => {
     const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.director);

  useEffect(() => {
    dispatch(fetchDirector());
  }, [dispatch]);

  if (loading) return (
    <div className="director-container">
      <div className="director-image skeleton-box"></div>

      <div className="director-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text short"></div>
      </div>
    </div>
  );


  return (
    <section className="director-section">
      <div className="director-container">
        
        {/* Left - Image */}
        <div className="director-image">
          <img
            src={`${import.meta.env.VITE_API_URL}/public/userImages/${data?.image}`}
            alt="Director"
          />
        </div>

        {/* Right - Content */}
        <div className="director-content">
          <h2>Words from Our Director</h2>
          <p className="director-message">
            "{data?.text}"
          </p>

          <h4 className="director-name">— Mr. Deepak Dhyani</h4>
          <span className="director-designation">
            Director, Syara Retails
          </span>
        </div>
      </div>
    </section>
  );
};

export default DirectorSection;