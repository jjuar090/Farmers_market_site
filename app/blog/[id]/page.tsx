// Import only what we need for basic functionality
// import Link from "next/link"; // Not needed for console display

// Interface for a simplified phone (not strictly used in this console example, but good to keep for context)
interface phone {
  _id : number;
  title : string;
  brand : string;
  image : string;
}

// Function to get ALL phones (the original code was changed to fetch a single phone by ID,
// but your fetch URL is for all phones, so we'll stick to that for console logging all)
async function getPhone(): Promise<phone[]> { // Changed return type to array of Phone
  try {
    const response = await fetch("https://jsonserver.reactbd.com/phone");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching phones:', error);
    return []; // Return empty array on error
  }
}


// Main component - modified to log JSON
export default async function PhoneDetailPage({ params }: PhoneDetailPageProps) {
  console.log("Attempting to fetch phone data...");
  const phones = await getPhone(); // Fetch all phones

  if (phones && phones.length > 0) {
    console.log("Successfully fetched phone data:");
    console.log(phones); // Log the entire array of phone objects
  } else {
    console.log("No phone data found or an error occurred during fetch.");
  }

  // This component must return JSX, even if it's just for console logging.
  return (
    <div>
      <h1>Check your browser console or terminal for phone data!</h1>
      <p>This page is set up to fetch data and log it.</p>
    </div>
  );
}