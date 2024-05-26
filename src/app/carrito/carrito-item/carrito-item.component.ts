import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CarritoItem } from '../carrito-item.interface';

@Component({
  selector: 'app-carrito-item',
  templateUrl: './carrito-item.component.html',
  styleUrl: './carrito-item.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarritoItemComponent {
  @Input() carritoItem!: CarritoItem;

  @Output() carritoItemDelete = new EventEmitter<void>();
  constructor() {}

  ngOnInit(): void {
    console.log(this.carritoItem);
  }

  onDeleteClicked(): void {
    this.carritoItemDelete.emit();
  }
}
