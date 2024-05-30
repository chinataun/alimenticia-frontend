import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from 'src/app/auth/model/user.interface';
import { RecetasService } from '../recetas.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { Autor } from 'src/app/user/user.interface';
import { AppService } from 'src/app/app.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recetas-user',
  templateUrl: './recetas-user.component.html',
  styleUrl: './recetas-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecetasUserComponent {
  autor$ = this.recetasService.autor$;
  id: string | null = null;
  userId$: Observable<Number | undefined> = this.authService.user$
    .pipe(
      map((user: User | null) => user?.userId)
    );
    baseUrl = environment.API_BASE_URL;
  constructor(
    private authService: AuthService,
    private recetasService: RecetasService,
    private route: ActivatedRoute,
    private appService: AppService,
  ) {
    this.appService.changeBannerImage('assets/banner/3.svg');

  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.recetasService.getUserRecetas(this.id).subscribe();
    this.recetasService.updateFavoriteRecipes();
  };



}
