if ((window as any)._initialData) {
  window.postMessage(
    { type: "FROM_PAGE", text: JSON.stringify((window as any)._initialData) },
    "*"
  );
}
