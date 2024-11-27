export default function formatDateAndTime (dateString){
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString();  // Formats to "MM/DD/YYYY"
  const formattedTime = date.toLocaleTimeString();  // Formats to "HH:MM:SS AM/PM"
  return `${formattedDate} ${formattedTime}`;
};
