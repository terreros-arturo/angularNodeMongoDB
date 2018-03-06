import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**usuarios */
import { UserEditComponent } from './components/user-edit.component';
/**artistas */
import { ArtistListComponent } from './components/artist.list.component';
/**home */
import { HomeComponent } from './components/home.component';
/**artista */
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';
/**album */
import { AlbumAddComponent } from  './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';


const appRoutes: Routes = [
    /**url vacia */
    {path: '', component: HomeComponent},
    /**Artistas */
    {path: 'artistas/:page', component: ArtistListComponent},
    {path: 'artista/:id', component: ArtistDetailComponent},
    {path: 'crear-artista', component: ArtistAddComponent},
    {path: 'editar-artista/:id', component: ArtistEditComponent},
    /**usuario */
    {path: 'mis-datos', component: UserEditComponent},
    /**album */
    {path: 'crear-album/:artist', component: AlbumAddComponent},
    {path: 'editar-album/:id', component: AlbumEditComponent},
    
    /**Cualquier otra url */
    {path: '**', component: HomeComponent}
];



export const appRoutingProviders: any[]= [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);