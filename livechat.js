const Innertube = require('youtubei.js');

async function start() {
    const videoId = process.env.VIDEO_ID;
    if (videoId === '') {
        console.log('Video ID is required');
        return;
    }

  const youtube = await new Innertube();

  const video = await youtube.getDetails(videoId);
  
  const livechat = video.getLivechat();

  // Updated stats about the livestream
  livechat.on('update-metadata', (data) => {
    console.info('Info:', data);
  });
   
  // Fired whenever there is a new message or other chat events
  livechat.on('chat-update', (message) => {
    let date = new Date(message.timestamp / 1000); // youtubei.js timestamp is in microseconds
    console.info(`- ${message.author.name}(${message.author.channel_id}) at (${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}) :\n  ${message.text}\n\n`);
  
    if(message.text == '!info') {
      livechat.sendMessage('Hello! This message was sent from YouTube.js');
    }
  });
}

start();