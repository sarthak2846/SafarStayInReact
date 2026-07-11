async function getCoords(location) {

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`,
    {
      headers: {
        "User-Agent": "MajorProject/1.0"
      }
    }
  );

  const data = await response.json();

  if (data.length === 0) {
    return null;
  }

  const latitude = parseFloat(data[0].lat);
  const longitude = parseFloat(data[0].lon);

  // GeoJSON format
  return {
    type: "Point",
    coordinates: [longitude, latitude]
  };
}

export default getCoords;