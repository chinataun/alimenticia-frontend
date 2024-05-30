import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Receta } from '../receta';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, map, take } from 'rxjs';
import { RecetasService } from '../recetas.service';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-receta-card',
  templateUrl: './receta-card.component.html',
  styleUrl: './receta-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecetaCardComponent {
  @Input() receta!: Receta;
  @Input() showButtons: 'all' | 'favorite' | 'editDelete' = 'all';

  isLoggedInObservable$ = this.authService.isLoggedIn$;
  isFavorite$!: Observable<boolean>;
  @Input() userId!: Number | null | undefined;
  
  @Output() recetaCardEditRecipe = new EventEmitter<void>();
  @Output() recetaCardRemoveRecipe = new EventEmitter<void>();

  category = this.route.snapshot.paramMap.get('nombre') || null;

  baseUrl = environment.API_BASE_URL;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private recetasService: RecetasService
  ) {}



  ngOnInit():void {
    this.isFavorite$ = this.recetasService.isFavorite(this.receta);
  }

  OnToggleFavorite(): void {
    this.isFavorite$.pipe(take(1)).subscribe(isFavorite => {
      if (isFavorite) {
        this.recetasService.removeFavoriteRecipe(this.receta).subscribe();
      } else {
        this.recetasService.addFavorite(this.receta).subscribe();
      }
    });
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
  
  OnEditReceta(): void {
    this.recetaCardEditRecipe.emit()
  }

  OnDeleteReceta(): void {
    this.recetaCardRemoveRecipe.emit()
  }

  navigateToRecetaDetails(): void {
    this.router.navigate(['receta', this.receta.id], {
      relativeTo: this.route,
    });
  }
}
