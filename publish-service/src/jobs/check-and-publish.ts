require('dotenv').config();

(async () => {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/posts/check-and-publish`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.STRAPI_ACCESS_TOKEN}`,
      },
    }
  );

  const resJson = await res.json();

  if (resJson.error) {
    console.error(resJson);
    throw new Error(resJson.error);
  }

  const data = resJson.data.attributes;
  const count = data.count;
  const postTitles = data.data;

  console.log(`Found ${count} posts to publish.`);
})();
