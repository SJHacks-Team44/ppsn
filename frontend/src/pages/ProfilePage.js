import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';
import './ProfilePage.css'; // ✅ we'll style it

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [userRoutes, setUserRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

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
              <ul className="routes-list">
                {userRoutes.map((route, idx) => (
                  <li key={idx}>
                    {route.start} ➔ {route.end}
                  </li>
                ))}
              </ul>
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
