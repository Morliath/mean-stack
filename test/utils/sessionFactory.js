const jwt = require('jsonwebtoken')

const JWT_KEY = process.env.JWT_KEY || "ABCDEFG123456789";
const expiration = 60 * 60;
const expiresIn = expiration * 1000;

module.exports = {
    getTokenData,
    login,
};

function getTokenData(email, userId) {
  const token = jwt.sign({ email: email, userId: userId }, JWT_KEY, {
    expiresIn: "" + expiresIn,
  });

  const expDate = new Date(new Date().getTime() + expiresIn);
  const expirationDate = expDate.toISOString();

  return {token, expirationDate}
}

async function login(email, userId, page){
  const token = getTokenData(email,userId)

  await page.evaluate((token, expirationDate, email) => {
      localStorage.setItem('token', token);
      localStorage.setItem("expirationDate", expirationDate);
      localStorage.setItem("userID", email);
    }, token.token, token.expirationDate, email);
}