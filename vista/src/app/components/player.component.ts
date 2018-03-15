import { Component, OnInit } from '@angular/core'
import { Song } from '../models/song';
import { GLOBAL } from  '../services/global';

@Component({
    selector: 'player',
    template: `
    <div class ="album-image">
        <span *ngIf = "song.album">
            <img id = "play-image-album" src = "{{url + 'get-image-album/' + song.album.image}}"/>
        </span>
        <span *ngIf="!song.album">
            <img id = "play-image-album" src = "./assets/images/default.jpg" />
        </span>
    </div>
    <div class="audio-file">
        <p>Reproduciendo...</p>
        <span id="play-song-title">
            {{song.name}}
        </span> 
        | 
        <span id="play-song-artist">
            <span *ngIf="song.album.artist" id ="play-song-artist-name">
                {{song.album.artist.name}}
            </span>
        </span>
        <audio controls id="player">
            <source id="mp3-source" src ="{{url + 'get-song-audio/' + song.file}}" type = "audio/mpeg"/>
            El navegador no es compatible con HTML 5
        </audio>
    </div>`
})


export class PlayerComponent implements OnInit{
    public url: string;
    public song: Song;

    constructor(){
        this.url = GLOBAL.url;
        this.song = new Song('',1,'','','','');
    }
    public ngOnInit(){
        console.log('Inicializando PlayerComponent');
        let song = JSON.parse(localStorage.getItem('sound_song'));

        console.log('song:');
        

        if(song){
            this.song = song;
        }else{
            this.song = new Song('',1,'','','','');
        }
        console.log(this.song);
    }


    public setSong(song: Song){
        console.log('Estableciendo cancion en reproductor');
    }
}