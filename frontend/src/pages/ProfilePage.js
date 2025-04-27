import React, { useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { MapContext } from '../MapContext'; // Add this
import './ProfilePage.css'; // Styling

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [userRoutes, setUserRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { setSearchAgainStart, setSearchAgainEnd } = useContext(MapContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }

        const routesRef = collection(db, "routes");
        const q = query(routesRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        setUserRoutes(querySnapshot.docs.map(doc => doc.data()));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSearchAgain = (start, end) => {
    setSearchAgainStart(start);
    setSearchAgainEnd(end);
    navigate('/');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      {user ? (
        <>
          <div className="profile-card">
            <h2>👤 {userProfile.userId}</h2>
            <p><strong>Email:</strong> {userProfile.email}</p>
            <p><strong>Joined:</strong> {userProfile.createdAt ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}</p>
          </div>

          <div className="routes-section">
            <h3>📍 Your Saved Routes</h3>
            {userRoutes.length === 0 ? (
              <p>No routes saved yet.</p>
            ) : (
              <div className="routes-grid">
                {userRoutes.map((route, idx) => (
                  <div className="route-card" key={idx}>
                    <p><strong>From:</strong> {route.start}</p>
                    <p><strong>To:</strong> {route.end}</p>
                    <button onClick={() => handleSearchAgain(route.start, route.end)}>🔎 Search Again</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link to="/" className="back-link">← Back to Map</Link>
        </>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
}

export default ProfilePage;
