const generateInvoiceNumber = () => {
  const timestamp =
    Date.now().toString();

  const randomPart =
    Math.floor(
      Math.random() * 10000
    )
      .toString()
      .padStart(4, "0");

  return `INV-${timestamp}-${randomPart}`;
};

module.exports = {
  generateInvoiceNumber,
};