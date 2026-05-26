export async function GET() {
  const query = `
    query($userName:String!) {
      user(login: $userName){
        contributionsCollection {
          contributionCalendar {
            totalContributions
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        userName: process.env.GITHUB_USERNAME,
      },
    }),
    cache: 'no-store',
  });

  const json = await response.json();

  return Response.json({
    contributions:
      json.data.user.contributionsCollection
        .contributionCalendar.totalContributions,
  });
}