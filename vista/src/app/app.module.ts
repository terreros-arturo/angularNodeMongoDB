import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; //formularios
import { HttpModule } from '@angular/http';
import { routing, appRoutingProviders } from './app.routing';

/**Home */
import { HomeComponent } from './components/home.component';

/**Usuario */
import { AppComponent } from './app.component';
import { UserEditComponent } from './components/user-edit.component';

/**Artista */
import { ArtistListComponent } from './components/artist.list.component';
import { ArtistAddComponent} from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

/**Album */
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';

/**Song */
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';
import { PlayerComponent } from './components/player.component';

@NgModule({
  /**Componentes, directivas o pipes */
  declarations: [ 
    AppComponent,
    HomeComponent,
    UserEditComponent,
    ArtistListComponent,
    ArtistAddComponent,
    ArtistEditComponent,
    ArtistDetailComponent,
    AlbumAddComponent,
    AlbumEditComponent,
    AlbumDetailComponent,
    SongAddComponent,
    SongEditComponent,
    PlayerComponent
  ],
  /**Otros NgModules, cuyas clases exportadas son requeridas por templates de componentes de este módulo. */
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  /**Los servicios que necesita este módulo, y que estarán disponibles para toda la aplicación. */
  providers: [appRoutingProviders],
  bootstrap: [AppComponent] //Componente con el que arranca la aplicación
})
export class AppModule { }
