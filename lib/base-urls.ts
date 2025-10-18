// const getBaseUrl = () => {
//   if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
//   if (process.env.DOMAIN_URL) return `https://${process.env.DOMAIN_URL}`;
//   if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
//   return "http://localhost:3000";
// };

// export default getBaseUrl;

function getBaseURL() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export default getBaseURL;
