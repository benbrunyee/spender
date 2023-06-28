import * as logger from "firebase-functions/logger";

export default (fn: (request: any) => Promise<any>) => {
  return async (request: any) => {
    try {
      const result = await fn(request);

      if (!result?.success) {
        const returnObj = !result
          ? { error: new Error("Execution failure"), msg: "Function failed to return a value" }
          : { error: result.error, msg: result.msg };

        logger.error(returnObj);
        return returnObj;
      }

      return result;
    } catch (error) {
      logger.error(error);
      return { error };
    }
  };
};
