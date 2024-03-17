const formatDateTime = (date: string): string => {
  const datetime = new Date(date);
  console.log(date)
  // Format the date in "DD-MM-YYYY" format 
  const formattedDate = datetime.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Format the time in "hh:mm" format
  const formattedTime = datetime.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Combine date and time into the desired format
  const formattedDateTime = `${formattedDate} at ${formattedTime}`;
  console.log(formattedDateTime);
  return formattedDateTime;
}

const formatDate = (date: string): string => {
  const datetime = new Date(date);
  console.log(date)
  // Format the date in "DD-MM-YYYY" format 
  const formattedDate = datetime.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return formattedDate;
}

export { formatDateTime, formatDate };