import { useEffect } from 'react';

export const getPlaceDetails = async (map) => {
  const { Place } = await google.maps.importLibrary("places");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const place = new Place({
    id: "ChIJN5Nz71W3j4ARhx5bwpTQEGg",
    requestedLanguage: "en",
  });

  await place.fetchFields({
    fields: ["displayName", "formattedAddress", "location"],
  });

  const marker = new AdvancedMarkerElement({
    map,
    position: place.location,
    title: place.displayName,
  });

  return {
    displayName: place.displayName,
    formattedAddress: place.formattedAddress,
    marker
  };
};
