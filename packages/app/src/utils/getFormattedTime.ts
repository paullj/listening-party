const getFormattedTime = (ms: number) => {
  const date = new Date(Date.UTC(0, 0, 0, 0, 0, 0, ms));
  const parts = [date.getUTCMinutes(), date.getUTCSeconds()];

  return parts.map((s) => String(s).padStart(2, "0")).join(":");
};

export { getFormattedTime };
