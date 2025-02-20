
const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Path to your service account key file
const serviceAccount = require(process.env.SERVICE_ACCOUNT_KEY_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = 'BIrN69k0kWdXmE6BbmetcopikfM2'; // Replace with the UID of the user you want to make a superadmin

admin.auth().setCustomUserClaims(uid, { superadmin: true })
  .then(() => {
    console.log(`Successfully set superadmin claim for user ${uid}`);
    process.exit();
  })
  .catch((error) => {
    console.error('Error setting superadmin claim:', error);
    process.exit(1);
  });