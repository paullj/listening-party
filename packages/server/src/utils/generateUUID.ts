import crypto from "crypto";

const generateUUID = () => crypto.randomUUID();

export { generateUUID };
