export async function GET() {
  try {
    const response = await fetch('https://leetcode-stats-api.onrender.com/zabedfolio', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('LeetCode Stats API request failed');
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      {
        status: 'error',
        message: error.message || 'Failed to fetch LeetCode stats',
      },
      { status: 500 }
    );
  }
}
