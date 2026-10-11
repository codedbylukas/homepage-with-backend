import { Component } from '@angular/core';
import { Footer } from './footer/footer';
import { Projects } from './projects/projects';
import { Header } from './header/header';

@Component({
  selector: 'app-home',
  imports: [Footer, Projects, Header],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
