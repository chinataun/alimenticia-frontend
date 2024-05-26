import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, map, pipe, takeUntil, tap, throwError } from 'rxjs';
import { CarritoItem } from './carrito-item.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private baseUrl = environment.API_BASE_URL;
  userId: number = 0;
  carrito: any = [];
  private unsubscribe$ = new Subject<void>();

  private items = new BehaviorSubject<CarritoItem[]>([]);
  items$ = this.items.asObservable();

  isCartVisible = new BehaviorSubject<boolean>(false);
  isCartVisible$ = this.isCartVisible.asObservable();

  cartItemCount$ = new BehaviorSubject<number>(0);
  carritoCount$ = this.cartItemCount$.asObservable();

  itemsCount$: Observable<number> = this.items$.pipe(
    map((items) => items.reduce((acc, item) => acc += item.cantidad, 0))
  );

  constructor(
    private httpClient: HttpClient,
    private userService: UserService,

    private toastr: ToastrService,
    // private authService: AuthService 
  ) {
    const storedCartItems = localStorage.getItem('cartItems');
    console.log(JSON.parse(storedCartItems as string)); // Add type assertion here
    if (storedCartItems) {
      const cartItems = JSON.parse(storedCartItems);
      this.items.next(cartItems);

    const totalQuantity = cartItems.reduce((sum: any, item: { cantidad: any; }) => sum + item.cantidad, 0);
    this.cartItemCount$.next(totalQuantity);   
    }

    this.userService.user_profile$.subscribe(userProfile => {
      if (userProfile) {
        
        this.userId = userProfile.id;
      }
    });
  //  this.authService.user$.subscribe(user => {
  //   this.userId = user?.userId;
  // })
  }

  total$: Observable<number> = this.items$.pipe(
    map((items) => items.reduce((acc, item) => {
      let precioNormal = parseFloat(item.producto.precioNormal);
      return acc += precioNormal * item.cantidad;
    }, 0).toFixed(2) as any as number)
  );

  // addItem(item: CarritoItem): void {
  //   this.items.next([...this.items.value, item]);
  // }

  addItem(producto: CarritoItem): void {
    // this.items.next([...this.items.value, item]);
    let currentItems = this.items.value;

    const itemIndex = currentItems.findIndex(item => {

      return item.producto.id === producto.producto.id;
    });
    if (itemIndex !== -1) {
      // El producto ya está en el carrito, incrementa la cantidad
      currentItems[itemIndex].cantidad++;
    } else {
      // El producto no está en el carrito, añádelo
      currentItems.push(producto);
    }

    this.items.next(currentItems);  
    this.cartItemCount$.next(this.cartItemCount$.getValue() + 1);
    localStorage.setItem('cartItems', JSON.stringify(this.items.getValue()));

  }

  deleteItem(producto: CarritoItem): void {
    // this.items.next(this.items.value.filter((item) => item !== itemToDelete));
    let currentItems = this.items.value;
    const itemIndex = currentItems.findIndex(item => item.producto.id === producto.producto.id);
    if (itemIndex !== -1) {
      // El producto está en el carrito, disminuye la cantidad
      if (currentItems[itemIndex].cantidad > 1) {
        const updatedItem = { ...currentItems[itemIndex], cantidad: currentItems[itemIndex].cantidad - 1 };
        currentItems = [...currentItems.slice(0, itemIndex), updatedItem, ...currentItems.slice(itemIndex + 1)];
      } else {
        // Si la cantidad es 1, elimina el ítem del carrito
        currentItems = [...currentItems.slice(0, itemIndex), ...currentItems.slice(itemIndex + 1)];
      }
      this.items.next(currentItems);
      this.cartItemCount$.next(this.cartItemCount$.getValue() - 1);
      if (currentItems.length === 0) {
        this.isCartVisible.next(false);
      }
      localStorage.setItem('cartItems', JSON.stringify(currentItems));
    }
  }

  hideCart(): void {
    this.isCartVisible.next(false);
  }
  
  toggleCartVisibility() {
    this.isCartVisible.next(!this.isCartVisible.getValue());
  }

  clearCarrito() {
    this.items.next([]);
    this.cartItemCount$.next(0);
    localStorage.removeItem('cartItems');
    this.isCartVisible.next(false);
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  
  saveCarrito(): void {
    const carrito = this.items.value;
    const carritos: any = {}; // Add index signature to carritos object
    let total = 0;
    let cartSupermarket = '';
    carritos.productos = []; // Initialize with an empty array for each supermarket
    for (const item of carrito) {
      cartSupermarket = item.producto.supermercado;
      if (carritos.supermercado !== cartSupermarket) {
        carritos.supermercado = item.producto.supermercado; // Initialize with an empty array for each supermarket
      }
      
      carritos.productos.push({producto: item.producto, cantidad: item.cantidad}); // Push items into the corresponding supermarket array
      total += item.cantidad * parseFloat(item.producto.precioNormal);
    }
    carritos.total =  total; // Add total to the supermarket array
    const params = {
      userId: this.userId,
      carrito: carritos
    }
    
    // console.log(params);
    this.httpClient.post<any>(`${this.baseUrl}/api/user/compras`,params)
    .pipe(takeUntil(this.unsubscribe$)).subscribe
    (response => {
      this.toastr.success(response.msg);
    });
     
  }

}
