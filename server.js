const express = require('express');
const app = express();
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');
const serviceAccount = require('C:/ServiceAccountKey/serviceAccountKey.json');
const { Firestore } = require('@google-cloud/firestore');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const bucket = admin.storage().bucket();
const db = new Firestore();

app.use(cors());
app.use(express.json());

app.post('/uploadProfilePicture', async (req, res) => {
  try {
    const { userId } = req.body;
    const file = req.file;
    const fileId = uuidv4(); // Generate a unique ID for the file

    const fileUpload = bucket.file(`profilePictures/${userId}/${fileId}`);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (error) => {
      // Handle any errors during the upload if needed
      console.log(error);
      res.status(500).json({ error: 'Unable to upload the file.' });
    });

    blobStream.on('finish', async () => {
      const downloadURL = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;

      try {
        // Update the user document in Firestore with the new profile picture URL
        const userRef = db.collection('users').doc(userId);
        await userRef.update({
          profilePictureURL: downloadURL,
        });

        res.status(200).json({ downloadURL });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An unexpected error occurred.' });
      }
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});