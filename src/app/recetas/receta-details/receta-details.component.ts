import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecetasService } from '../recetas.service';
import { Receta } from '../receta';
import { BehaviorSubject, Observable, Subject, combineLatest, map, of, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UserProfile } from 'src/app/user/model/user-profile.interface';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-receta-details',
  templateUrl: './receta-details.component.html',
  styleUrl: './receta-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class RecetaDetailsComponent implements OnInit{

  isVoted$: Observable<{voted: boolean, rating?: number, comment?: string}> = of({voted: false});
  comentarioDelUsuario: string | null = null;
  // private voteInfo = new Subject<{voted: boolean, rating?: number, comment?: string}>();
  // voteInfo$ = this.voteInfo.asObservable();
  voteInfo = new BehaviorSubject<{voted: boolean, rating?: number, comment?: string}>({voted: false});
  voteInfo$ = this.voteInfo.asObservable();
  rating$!: Observable<number>;
  private onDestroy$ = new Subject<void>();
  id!: number;
  receta$ = this.recetasService.receta$;
  userId$: Observable<Number | undefined> = this.authService.userProfile$
    .pipe(
      map((user: UserProfile | null) => user?.id)
    );
  
    sameAutor = combineLatest([this.receta$, this.userId$]).pipe(
      map(([receta, id]) => receta.autor.id === id)
    );
    
  total$ = this.receta$.pipe(
    map(receta => receta.ingredientes.reduce((acc, ingrediente) => {
      const precio = Number(ingrediente.precio);
      return acc + (isNaN(precio) ? 0 : precio * Number(ingrediente.cantidad));
    }, 0))
  );

  constructor(
    private route: ActivatedRoute,
    private recetasService: RecetasService,
    private authService: AuthService,

    private router: Router,
    private cd: ChangeDetectorRef,

    private appService: AppService,
  ) {
    this.appService.changeBannerImage('assets/banner/3.svg');
    

  }
  
  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.receta$ = this.recetasService.getReceta(this.id);
    this.receta$.subscribe(receta => {
      // Aquí va tu código para manejar la receta actualizada...
      console.log(receta)
    });


    this.recetasService.isVoted(this.id).subscribe(
      (voted) => {
        console.log('Votado:', voted);
        this.voteInfo.next(voted);
      }
    )
  }

  OnEditReceta(): void {
    this.router.navigate(['/recetas/receta/edit', this.id], {
      relativeTo: this.route,
    });
  }

  OnDeleteReceta(): void {
    // this.recetasService.removeCreatedRecipe(receta).subscribe((result) => {
    //   this.toastr.success(result.message);
    // });
  }



  votar(rating: number, comment: string) {
    console.log('Votando receta', this.id, rating, comment);
    this.recetasService.votarReceta(this.id, rating, comment)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((response) => {
        this.recetasService.updateRecetaActualizada(response.receta);
        this.receta$ = this.recetasService.getReceta(this.id);
        console.log(response.receta);
        this.voteInfo.next({voted: true, rating, comment});
      });
      this.cd.detectChanges();
  }
  range(n: number): number[] {
    return Array(n).fill(0).map((x, i) => i);
  }
  floor(n: number): number {
    return Math.floor(n);
  }
  
  ceil(n: number): number {
    return Math.ceil(n);
  }
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  // getReceta(): void {
  //   const id = this.route.snapshot.paramMap.get('id');
  //   this.recetasService.getReceta(Number(id))
  //     .pipe(
  //       map(receta => of(receta))
  //     )
  //     .subscribe(receta => this.receta$ = receta);
  // }

}
