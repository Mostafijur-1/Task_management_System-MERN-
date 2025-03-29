import mongoose from "mongoose";

const isValidString = (str) => {
  return str && str.trim().length > 0;
};

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const areValidObjectIds = (arr) => {
  if (!Array.isArray(arr)) return false;
  return arr.every((id) => mongoose.Types.ObjectId.isValid(id));
};

const isValidEnum = (value, allowedValues) => {
  return allowedValues.includes(value);
};

const isValidDate = (date) => {
  return !isNaN(new Date(date).getTime());
};

const sanitizeInput = (obj) => {
  const sanitized = {};

  // Loop through object keys
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      // Trim string values
      sanitized[key] = value.trim();
    } else if (Array.isArray(value)) {
      // If array, sanitize each element if string
      sanitized[key] = value.map((elem) =>
        typeof elem === "string" ? elem.trim() : elem
      );
    } else {
      // Keep as is for other types
      sanitized[key] = value;
    }
  }

  return sanitized;
};

export {
  isValidString,
  isValidObjectId,
  areValidObjectIds,
  isValidEnum,
  isValidDate,
  sanitizeInput,
};
