const SpotifyPlayer = () => {
  return (
    <div className="spotify-player">
      <iframe
        style={{ borderRadius: '12px' }}
        src="https://open.spotify.com/embed/track/754kgU5rWscRTfvlsuEwFp?utm_source=generator"
        width="100%"
        height="152"
        frameBorder="0"
        allowFullScreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
};

export default SpotifyPlayer; 