export default (code: string, redirect_uri: string) => {
  return (
    "https://api.monzo.com/oauth2/token" +
    "?grant_type=authorization_code" +
    "&client_id=" +
    process.env.MONZO_CLIENT_ID +
    "&client_secret=" +
    process.env.MONZO_CLIENT_SECRET +
    "&redirect_uri=" +
    redirect_uri +
    "&code=" +
    code
  );
};
