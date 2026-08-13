import proxy from "express-http-proxy";

export const proxywithHeader = (url) => {
  return proxy(url, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["x-user-id"] = srcReq.user.userid;
      return proxyReqOpts;
    },
  });
};