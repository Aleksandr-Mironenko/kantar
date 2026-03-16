import getNameServices from "@/app/api/get-name-services/get-name-services";

export const revalidate = 3600;
export default async function sitemap() {
  const base = "https://kantar-logistics.ru";

  const services: string[] | null = await getNameServices()


  const serviceUrls = (services ?? []).map((service) => ({
    url: `${base}/services/${service}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,

  }));

  return [
    {
      url: `${base}/contacts`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/services/all`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/info`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/policy`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/services`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...serviceUrls,
  ];
}