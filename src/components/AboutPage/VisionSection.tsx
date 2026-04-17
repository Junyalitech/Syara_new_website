import React, { useEffect } from "react";
import "./VisionSection.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchVision } from "../../features/about/VisionSlice";

const VisionSection = () => {

  const dispatch = useDispatch();
  const { data, loading } = useSelector((state: any) => state.vision);

  useEffect(() => {
    dispatch(fetchVision());
  }, [dispatch]);

  console.log("Vision Data:", data);

  return (
    <section className="vision">

      {loading ? (
        // 🔥 Skeleton Loader
        <div className="vision-skeleton">
          <div className="vision-img-skel"></div>
          <div className="vision-content-skel">
            <div className="title-skel"></div>
            <div className="text-skel"></div>
            <div className="btn-skel"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="vision__image">
            <img
              src={`${import.meta.env.VITE_API_URL}/public/userImages/${data?.image}`}
              alt="vision"  
            />
          </div>

          <div className="vision__content">
            <h2 className="vision__title">{ "Our Vision"}</h2>

            <p className="vision__text">
              <span>{data?.text1}</span>
              <span>{data?.text2}</span>
              <span>{data?.text3}</span>
              <span>{data?.text4}</span>
              <span>{data?.text5}</span>
              <span>{data?.text6}</span>
              <span>{data?.text7}</span>
              <span>{data?.text8}</span>
              <span>{data?.text9}</span>
              <span>{data?.text10}</span>
            </p>

            {/* <button className="vision__btn">Learn More</button> */}
          </div>
        </>
      )}

    </section>
  );
};

export default VisionSection;