export default (endpoint: string, accessToken?: string, params?: object) => {
  const url = new URL(endpoint, "https://api.monzo.com");

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  return fetch(
    url,
    accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : {},
  );
};
