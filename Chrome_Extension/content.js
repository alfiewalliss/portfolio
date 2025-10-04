(async () => {
  var athleteProfile = getAthleteProfileProps();

  var individualActivies = athleteProfile.appContext.preFetchedEntries
    .filter((r) => r.entity === "Activity")
    .map((r) => {
      if (r.activity.type != "Run") return null;
      return {
        distance: r.activity.stats[0].value.replace(
          "<abbr class='unit' title='kilometers'> km</abbr>",
          ""
        ),
        date: r.activity.startDate,
      };
    })
    .filter((r) => r != null);

  var groupActivies = athleteProfile.appContext.preFetchedEntries
    .filter((r) => r.entity === "GroupActivity")
    .map((r) => {
      if (r.rowData.activities[0].type != "Run") return null;
      return {
        distance: r.rowData.activities[0].stats[0].value.replace(
          "<abbr class='unit' title='kilometers'> km</abbr>",
          ""
        ),
        date: r.rowData.activities[0].start_date,
      };
    })
    .filter((r) => r != null);

  console.log(
    "activity",
    athleteProfile.appContext.preFetchedEntries.filter(
      (r) => r.entity === "Activity"
    )
  );
  console.log(
    "activity",
    athleteProfile.appContext.preFetchedEntries.filter(
      (r) => r.entity === "GroupActivity"
    )
  );
  console.log("individualActivies", individualActivies);
  console.log("groupActivies", groupActivies);

  var allActivities = individualActivies.concat(groupActivies);

  var userId = window.location.href.replace(
    "https://www.strava.com/athletes/",
    ""
  );

  if (userId.includes("?")) {
    userId = userId.slice(
      0,
      window.location.href
        .replace("https://www.strava.com/athletes/", "")
        .indexOf("?")
    );
  }

  var request = {
    userId,
    activities: allActivities,
  };

  await postTestData(request);
})();

async function postTestData(red) {
  const endpoint =
    "https://us-central1-techrunningalfie.cloudfunctions.net/api/data";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(red),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Success! Posted data:", result);
      return result;
    } else {
      console.error(
        "Failed to post data:",
        response.status,
        response.statusText
      );
      const errorText = await response.text();
      console.error("Error details:", errorText);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

// Find div with data-react-class="AthleteProfileHeaderMediaGrid" and extract data-react-props
function getAthleteProfileHeaderData() {
  // Find the div with the specific data-react-class
  const targetDiv = document.querySelector(
    'div[class="content react-feed-component"]'
  );

  if (!targetDiv) {
    console.log("No div found with data-react-class='Microfrontend'");
    return null;
  }

  // Get the data-react-props value
  const reactProps = targetDiv.getAttribute("data-react-props");

  if (!reactProps) {
    console.log("No data-react-props found on the target div");
    return null;
  }

  // Parse the JSON data
  try {
    const parsedProps = JSON.parse(reactProps);
    return {
      element: targetDiv,
      rawProps: reactProps,
      parsedProps: parsedProps,
    };
  } catch (error) {
    console.error("Failed to parse data-react-props JSON:", error);
    return {
      element: targetDiv,
      rawProps: reactProps,
      parseError: error.message,
    };
  }
}

// Specific function to get just the AthleteProfileHeaderMediaGrid data
function getAthleteProfileProps() {
  const data = getAthleteProfileHeaderData();

  if (data && data.parsedProps) {
    return data.parsedProps;
  }

  return null;
}
