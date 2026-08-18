const mongoose = require("mongoose");

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

if (!isValidObjectId(saleId)) {
  throw new AppError(
    "Invalid sale ID",
    400
  );
}

module.exports = {
  isValidObjectId,
};

