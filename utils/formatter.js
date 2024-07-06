const formatValidationErrorMessage = (message) => {
     const regex = /["]+/g;
     return message.replace(regex, "");
};

module.exports = { formatValidationErrorMessage };
