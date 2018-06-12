const clientID = '880f9caf22de4756a48d85ee5ba22500';
const redirectURI = 'https://elijahrus.github.io/eljamming/';
//const redirectURI = 'http://eljamming.surge.sh';


let userAccessToken = '';

const Spotify = {

  getAccessToken: function() {
    if(userAccessToken) {
      return userAccessToken;
    }
    const url = window.location.href;

    const accessToken = url.match(/access_token=([^&]*)/);
    const expiresIn = url.match(/expires_in=([^&]*)/);

    if(accessToken && expiresIn) {
      userAccessToken = accessToken[1];
      let expirationTime = Number(expiresIn[1]) * 1000;

      window.setTimeout(() => {
        userAccessToken = '';
      }, expirationTime);
      window.history.pushState('Access Token', null, '/');
      return userAccessToken;

    }else if(!userAccessToken && !accessToken) {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  search: function(term) {
    const accessToken = this.getAccessToken();
    const endpoint = `https://api.spotify.com/v1/search?type=track&q=${term}`;
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    return fetch(endpoint, {
      headers: headers
    })
    .then(response => response.json())
    .then(jsonResponse => {
      console.log(jsonResponse);

      if(!jsonResponse.tracks) {
        return [];
      }

      return jsonResponse.tracks.items.map(currTrack => {
        return {
          id: currTrack.id,
          name: currTrack.name,
          artist: currTrack.artists[0].name,
          album: currTrack.album.name,
          uri: currTrack.uri
        };
      });
    });
  },
  savePlaylist: function(playlistName, trackUris) {
    if(!playlistName || !trackUris){
      return;
    }
    const accessToken = this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

    return fetch('https://api.spotify.com/v1/me', {
      headers: headers
    })
    .then(response => response.json())
    .then(jsonResponse => jsonResponse.id)
    .then(userId => {
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        body: JSON.stringify({ name: playlistName }),
        method: 'POST'
      })
        .then(response => response.json())
        .then(jsonResponse => {
          const playlistId = jsonResponse.id;
          const addSongsUrl = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
          fetch(addSongsUrl, {
            headers: headers,
            body: JSON.stringify({ uris: trackUris }),
            method: 'POST'
          })
        })

    });

  }

};

export default Spotify;
