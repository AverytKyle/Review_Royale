// import { useEffect } from 'react';

// export const getPlaceDetails = async (map) => {
//   const { Place } = await google.maps.importLibrary("places");
//   const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

//   const initialPlace  = new Place({
//     id: "ChIJN5Nz71W3j4ARhx5bwpTQEGg",
//     requestedLanguage: "en",
//   });

//   const fields = await initialPlace.fetchFields({
//     fields: ["displayName", "formattedAddress", "location", "hasDelivery", "id", "rating", "userRatingCount", "reviews", "websiteURI"]
//   });

//   const place = new Place({
//     id: String(fields.id),
//     requestedLanguage: "en",
//   });

//   const marker = new AdvancedMarkerElement({
//     map,
//     position: place.location,
//     title: place.displayName,
//   });

//   return {
//     id: place.id,
//     displayName: place.displayName,
//     formattedAddress: place.formattedAddress,
//     location: place.location,
//     hasDelivery: place.hasDelivery,
//     rating: place.rating,
//     userRatingCount: place.userRatingCount,
//     reviews: place.reviews,
//     website: place.websiteURI,
//     marker
//   };
// };
