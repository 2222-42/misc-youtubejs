import { download } from './module/download.js';

import fs from 'fs';
import Innertube from 'youtubei.js';
const creds_path = './yt_oauth_creds.json'; 

async function download_private() {
  const creds = fs.existsSync(creds_path) && JSON.parse(fs.readFileSync(creds_path).toString()) || {};
  const youtube = await new Innertube();
  
  youtube.ev.on('auth', (data) => {
    if (data.status === 'AUTHORIZATION_PENDING') {
      console.info(`Hello!\nOn your phone or computer, go to ${data.verification_url} and enter the code ${data.code}`);
    } else if (data.status === 'SUCCESS') {
      fs.writeFileSync(creds_path, JSON.stringify(data.credentials));
      console.info('Successfully signed-in, enjoy!');
    }
  });
  
  youtube.ev.on('update-credentials', (data) => {
    fs.writeFileSync(creds_path, JSON.stringify(data.credentials));
    console.info('Credentials updated!', data);
  });
  
  await youtube.signIn(creds);
  
  download();


  const response = await youtube.signOut();
  if (response.success) {
    console.log('You have successfully signed out');
  }
}

download_private();