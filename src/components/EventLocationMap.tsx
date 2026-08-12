interface Props {
  location: string;
}

// Shows the invitee where the (already decided) venue is — distinct from
// VenueSearchButton, which helps the organizer find a venue in the first
// place. Uses Google's key-less embed/link URL formats, since this project
// has no Google Maps API key.
export default function EventLocationMap({ location }: Props) {
  if (!location.trim()) return null;

  const query = encodeURIComponent(location.trim());
  const embedSrc = `https://www.google.com/maps?q=${query}&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-black/10">
      <iframe
        src={embedSrc}
        width="100%"
        height="160"
        style={{ border: 0, display: "block" }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`${location}の地図`}
      />
      <a
        href={mapLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white/90 px-3 py-2 text-center text-xs font-semibold text-blue-600 hover:bg-white"
      >
        Googleマップで開く
      </a>
    </div>
  );
}
