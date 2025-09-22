import React, { useState } from "react";
import api from "../axiosConfig";

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard({ token }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [results, setResults] = useState([]);

  const headers = { Authorization: `Bearer ${token}` };

  const createResource = async () => {
    const res = await api.post(
      `${API_URL}/api/resources`,
      { title, url, source: `manual` },
      { headers }
    );
    alert("Resource created: " + res.data.title);
  };

  const listResources = async () => {
    const res = await api.get(`${API_URL}/api/resources/`, { headers });
    setResults(res.data || []);
  };

  const saveYoutubeVideo = async (videoId, title) => {
    await api.post(
      `${API_URL}/api/resources`,
      {
        title,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        source: `youtube`,
      },
      { headers }
    );
    alert("Saved video: " + title);
  };

  const youtubeSearch = async () => {
    const res = await api.get(`${API_URL}/api/external/youtube?q=${title}`, {
      headers,
    });
    try {
      setResults(res.data.results || []);
    } catch (err) {
      alert("Youtube search currently unavailable, please retry later");
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={createResource}>Create Resource</button>
      <button onClick={listResources}>List Resources</button>
      <button onClick={youtubeSearch}>Search YouTube</button>

      <h3>Results</h3>
      <div>
        {results.map((item) => (
          <div key={item.id || item.videoId} style={{ margin: "1rem 0" }}>
            {/* If it has videoId -> it's a YouTube result */}
            {item.videoId ? (
              <>
                <img src={item.thumbnail} alt={item.title} />
                <h4>{item.title}</h4>
                <p>{item.channel}</p>
                <p>{item.description}</p>
                <button
                  onClick={() => saveYoutubeVideo(item.videoId, item.title)}
                >
                  Save
                </button>
              </>
            ) : (
              /* Otherwise, it's a saved resource */
              <>
                <h4>{item.title}</h4>
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.url}
                </a>
                <p>Source: {item.source || "manual"}</p>
                <small>
                  Added: {new Date(item.created_at).toLocaleString()}
                </small>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
