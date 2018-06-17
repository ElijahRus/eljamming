import React, { Component } from 'react';
import './App.css';
import PlayList from '../PlayList/PlayList';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults.js';
import Spotify from '../../util/Spotify.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],

      playlistName: 'Enter Playlist Name',

      playlistTracks: []

      };

      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this);
      this.updatePlaylistName = this.updatePlaylistName.bind(this);
      this.savePlaylist = this.savePlaylist.bind(this);
      this.search = this.search.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }else {
      let tracks = this.state.playlistTracks;
      let newSearchResults = this.state.searchResults.filter(q => q !== track);
      tracks.push(track);
      this.setState({ playlistTracks: tracks });
      this.setState({ searchResults: newSearchResults });
      console.log('newSearchResults', newSearchResults);
    }
  }

  removeTrack(track) {
    let ourTrack = (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id));
    let newPlaylistTracks = this.state.playlistTracks.filter(q => q !== ourTrack);

    this.setState({playlistTracks: newPlaylistTracks});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(array => array.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
          playlistTracks: []
        , playlistName: 'Enter Playyy Name'
        , searchResults: []
      });
    });
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(tracks => {
      console.log(tracks);
      this.setState({ searchResults: tracks});
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults}
                           onAdd={this.addTrack} />
            <PlayList playlistName={this.state.playlistName}
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
