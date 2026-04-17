import { useEffect } from 'react';
import './TeamSection.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeam } from '../../features/about/teamSlice';

const team = [
  { name: 'Annette Black', role: 'Design Director', initials: 'AB' },
  { name: 'Oscar Lane', role: 'Jewelry Photographer', initials: 'OL' },
  { name: 'Brooklyn Simmons', role: 'Polishing Artisan', initials: 'BS' },
  { name: 'Darlene Robertson', role: 'Sales Lead', initials: 'DR' },
];

const TeamSection = () => {
  const dispatch = useDispatch();
  const { members, loading } = useSelector((state: any) => state.team);

  useEffect(() => {
    dispatch(fetchTeam());
  }, [dispatch]);
  return (
    <section className="team">
      <p className="team__label">Our Team</p>
      <h2 className="team__title">Where Expertise Shines</h2>
      <div className="team__grid">
         {loading ? (
          // 🔥 Skeleton Loader
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="team-skeleton"></div>
          ))
        ) : (
          members.map((m: any) => (
            <div className="team-member" key={m.id}>

              {/* Avatar */}
              <div className="team-member__avatar">
                {m.image ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/public/userImages/${m.image}`}
                    alt={m.name}
                  />
                ) : (
                  m.name?.charAt(0)
                )}
              </div>

              <p className="team-member__name">{m.name}</p>
              <p className="team-member__role">{m.position}</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
};

export default TeamSection;
