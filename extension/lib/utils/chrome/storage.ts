export const readLocalStorage = async (key: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function (result) {
      if (result[key] === undefined) {
        resolve(undefined);
      } else {
        resolve(result[key]);
      }
    });
  });
};
