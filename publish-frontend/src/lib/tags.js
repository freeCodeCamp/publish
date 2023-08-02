// Tag API calls

const api_root = `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/api`;

export async function getTags() {
  const res = await fetch(`${api_root}/tags`);
  if (!res.ok) {
    throw new Error('getTags Failed');
  }
  return res.json();
}
