import { LISTING_LIMIT_PER_PAGE } from "../../../env.json";

function getUnappliedListingIds(): string[] {
  //check page

  const limit = LISTING_LIMIT_PER_PAGE;
  let totalListings = 0;

  //loop to get
  while (totalListings < 100) {
    const jobIds = Object.keys(
      (window as any)._initialData.jobKeysWithTwoPaneEligibility
    );

    unappliedJobIds = await fetch('https://your.api/endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add other headers as needed
      },
      body: JSON.stringify({strings: data})
    });

    for(let i = 0; i <= jobIds.length; i++){

    }
  }

  return [""];
}
