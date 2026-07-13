async function getCoords(location) {
  try {
    const apiKey = process.env.MAPTILER_API_KEY;
    if (!apiKey) {
      console.error("Missing MAPTILER_API_KEY environment variable....");
      return null;
    }

    const response = await fetch(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${apiKey}&limit=1`
    );

    if (!response.ok) {
      console.error(`MapTiler API Error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return null;
    }

    const [longitude, latitude] = data.features[0].geometry.coordinates;

    return {
      type: "Point",
      coordinates: [longitude, latitude]
    };

  } catch (error) {
    console.error("Error in MapTiler getCoords:", error.message);
    return null;
  }
}

export default getCoords;
